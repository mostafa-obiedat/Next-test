const WelcomeBanner = require("../components/WelcomeBanner");
const PatientList = require("../components/PatientList");
const AppointmentCalendar = require("../components/AppointmentCalendar");
const Notifications = require("../components/Notifications");
const { verifyToken } = require("../lib/auth");

async function ProviderDashboard({ req }) {
  //const user = verifyToken(req); // يفترض أن Middleware يمرر المستخدم
  if (!user || !["doctor", "nurse"].includes(user.role)) {
    return Response.redirect("/login"); // إعادة توجيه إذا لم يكن Doctor/Nurse
  }

  const [patients, appointments, notifications] = await Promise.all([
    fetchPatients(user.id),
    fetchAppointments(user.id),
    fetchNotifications(user.id),
  ]);

  return (
    <div>
      <WelcomeBanner name={user.name} role={user.role} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AppointmentCalendar appointments={appointments} user={user} />
          <PatientList patients={patients} user={user} />
        </div>
        <Notifications notifications={notifications} />
      </div>
    </div>
  );
}

async function fetchPatients(userId) {
  const res = await fetch(`http://localhost:3000/api/patients?doctorId=${userId}`);
  return res.json();
}

async function fetchAppointments(userId) {
  const res = await fetch(`http://localhost:3000/api/appointments?doctorId=${userId}`);
  return res.json();
}

async function fetchNotifications(userId) {
  const res = await fetch(`http://localhost:3000/api/notifications?userId=${userId}`);
  return res.json();
}

module.exports = ProviderDashboard;