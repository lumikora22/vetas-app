// app/page.tsx

export default async function HomePage() {
  // const articulos = await fetchArticulos();
  // console.log(articulos);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data from Supabase</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {/* {JSON.stringify(articulos, null, 2)} */}
      </pre>
    </div>
  );
}
