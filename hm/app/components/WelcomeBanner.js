function WelcomeBanner({ name, role }) {
    return (
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold">Welcome, {name} ({role})</h1>
      </div>
    );
  }
  
  module.exports = WelcomeBanner;