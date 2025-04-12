"use client"


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
          About Us
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We are dedicated to simplifying hospital operations and improving patient care through our advanced hospital management system. Our platform connects administrators, healthcare providers, and patients seamlessly, ensuring efficient management of records, appointments, billing, and staff schedules.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our team consists of passionate developers, healthcare experts, and innovators working together to create a reliable and user-friendly solution for modern healthcare needs. We aim to empower hospitals with technology that saves time and enhances service quality.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Secure and scalable platform</li>
            <li>Role-based access for all users</li>
            <li>Real-time updates and analytics</li>
            <li>Responsive design for all devices</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

