import Link from "next/link";

const placeholderImages = [
  "/images/placeholder1.jpg",
  "/images/placeholder2.jpg",
  "/images/placeholder3.jpg",
  "/images/placeholder4.jpg",
  "/images/placeholder5.jpg",
  "/images/placeholder6.jpg",
];

export default async function DashboardPage() {
  // if (!session?.user) {
  //   return (
  //     <div className="max-w-xl mx-auto py-16 text-center">
  //       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
  //       <p className="mb-4">You must be signed in to view the dashboard.</p>
  //       <Link href="/auth/signin" className="text-blue-600 hover:underline">
  //         Sign In
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {/* <p className="mb-8 text-neutral-700">
        Welcome, <span className="font-semibold">{session.user.name}</span>! Select an image below to annotate.
      </p> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {placeholderImages.map((src, idx) => (
          <div key={src} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow bg-white flex flex-col items-center">
            <img
              src={src}
              alt={`Placeholder ${idx + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 w-full flex justify-center">
              <Link
                href={`/annotate?image=${encodeURIComponent(src)}`}
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition"
              >
                Annotate
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}