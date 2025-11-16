import Image from 'next/image'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">About Us</h1>

      <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
        Hi! We’re <strong>Kalyan</strong>, <strong>Mrinal</strong>, and <strong>Preethi</strong> —
        three developers passionate about learning and building together. This project was created
        as part of our journey to explore <strong>Next.js</strong> development end-to-end. We wanted
        to learn how to structure a full application, connect external APIs, and deploy something
        real that reflects both our teamwork and what we’ve learned along the way.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <Image
            src="/images/Kalyan.jpg"
            alt="Kalyan"
            className="w-32 h-32 object-cover rounded-full mb-4 shadow-md"
            width={128}
            height={128}
          />
          <h2 className="font-semibold text-lg text-gray-800">Kalyan</h2>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/images/Mrinal.jpg"
            alt="Mrinal"
            className="w-32 h-32 object-cover rounded-full mb-4 shadow-md"
            width={128}
            height={128}
          />
          <h2 className="font-semibold text-lg text-gray-800">Mrinal</h2>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/images/Preethi.jpg"
            alt="Preethi"
            className="w-32 h-32 object-cover rounded-full mb-4 shadow-md"
            width={128}
            height={128}
          />
          <h2 className="font-semibold text-lg text-gray-800">Preethi</h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Project</h3>
        <p className="text-gray-600 text-base">
          [Project description placeholder] — we’ll update this section later with details about our
          project’s functionality, goals, and how it integrates various APIs. We’ll also add a short
          summary of our <strong>tech stack</strong> and architecture once the project is complete.
        </p>
      </div>
    </div>
  )
}
