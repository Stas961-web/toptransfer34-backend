import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "PAID" | "CANCELLED";

type Booking = {
  id: string;
  created_at: string;
  status: BookingStatus;

  client_name: string;
  client_email: string;
  phone: string | null;

  pickup: string;
  dropoff: string;

  passengers: number | null;
  vehicle_type: string | null;
  booking_type: string | null;
  flight_number: string | null;

  estimated_price: number | null;
  payment_method: string | null;
  notes: string | null;
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  // login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const filtered = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  async function loadSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setError(error.message);
      setSessionEmail(null);
      return;
    }
    const s = data.session;
    setSessionEmail(s?.user?.email ?? null);
  }

  async function loadBookings() {
    setError(null);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(
        `Не могу загрузить bookings (скорее всего ты не админ или не залогинен): ${error.message}`
      );
      setBookings([]);
      return;
    }
    setBookings((data ?? []) as Booking[]);
  }

  useEffect(() => {
    let alive = true;
  
    (async () => {
      setLoading(true);
      await loadSession();
  
      // если сессия уже есть (например ты был залогинен раньше) — грузим bookings
      const { data } = await supabase.auth.getSession();
      if (alive && data.session) {
        await loadBookings();
      }
  
      if (alive) setLoading(false);
    })();
  
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!alive) return;
  
      setSessionEmail(session?.user?.email ?? null);
  
      // грузим bookings ТОЛЬКО когда есть session
      if (session) {
        await loadBookings();
      } else {
        setBookings([]);
      }
    });
  
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
  }

  async function signOut() {
    setError(null);
    await supabase.auth.signOut();
    setBookings([]);
  }

  async function updateStatus(id: string, status: BookingStatus) {
    setError(null);

    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      setError(`Не удалось обновить статус: ${error.message}`);
      return;
    }

    // локально обновим список
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 24, color: "white" }}>
        <h2>Admin</h2>
        <p>Загрузка…</p>
      </div>
    );
  }

  // ======= LOGIN =======
  if (!sessionEmail) {
    return (
      <div style={{ padding: 24, maxWidth: 520, color: "white" }}>
        <h2>Admin Login</h2>
        <p style={{ opacity: 0.8 }}>
          Войди email/password (Supabase Auth). Только админ-юзер сможет видеть и
          менять заказы.
        </p>

        <form onSubmit={signIn} style={{ display: "grid", gap: 12 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ padding: 10, borderRadius: 8 }}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            style={{ padding: 10, borderRadius: 8 }}
          />
          <button
            type="submit"
            style={{
              padding: 12,
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>

        {error && (
          <div style={{ marginTop: 14, color: "#ffb4b4" }}>
            <b>Ошибка:</b> {error}
          </div>
        )}
      </div>
    );
  }

  // ======= ADMIN PANEL =======
  return (
    <div style={{ padding: 24, color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin</h2>
          <div style={{ opacity: 0.8 }}>Logged: {sessionEmail}</div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{ padding: 10, borderRadius: 8 }}
          >
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button
            onClick={loadBookings}
            style={{ padding: 10, borderRadius: 10, cursor: "pointer" }}
          >
            Refresh
          </button>

          <button
            onClick={signOut}
            style={{ padding: 10, borderRadius: 10, cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 14, color: "#ffb4b4" }}>
          <b>Ошибка:</b> {error}
        </div>
      )}

      <div style={{ marginTop: 18, opacity: 0.8 }}>
        Всего: {bookings.length} | Показано: {filtered.length}
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {filtered.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 14,
              padding: 14,
              background: "rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>{b.client_name}</b>{" "}
                <span style={{ opacity: 0.8 }}>({b.client_email})</span>
                {b.phone ? <span style={{ opacity: 0.8 }}> · {b.phone}</span> : null}
                <div style={{ opacity: 0.75, fontSize: 13 }}>
                  {fmtDate(b.created_at)} · ID: {b.id}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>{b.status}</div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>
                  {b.estimated_price ? `${b.estimated_price}€` : "—"} ·{" "}
                  {b.payment_method ?? "—"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 10, lineHeight: 1.35 }}>
              <div>
                <b>From:</b> {b.pickup}
              </div>
              <div>
                <b>To:</b> {b.dropoff}
              </div>

              <div style={{ opacity: 0.85, marginTop: 6 }}>
                Pax: {b.passengers ?? "—"} · Vehicle: {b.vehicle_type ?? "—"} · Type:{" "}
                {b.booking_type ?? "—"} · Flight: {b.flight_number ?? "—"}
              </div>

              {b.notes ? (
                <div style={{ marginTop: 8, opacity: 0.9 }}>
                  <b>Notes:</b> {b.notes}
                </div>
              ) : null}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => updateStatus(b.id, "CONFIRMED")}
                style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
              >
                Confirm
              </button>
              <button
                onClick={() => updateStatus(b.id, "REJECTED")}
                style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus(b.id, "PAID")}
                style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
              >
                Mark Paid
              </button>
              <button
                onClick={() => updateStatus(b.id, "CANCELLED")}
                style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 ? (
          <div style={{ opacity: 0.8, marginTop: 10 }}>Пока нет заказов.</div>
        ) : null}
      </div>
    </div>
  );
}