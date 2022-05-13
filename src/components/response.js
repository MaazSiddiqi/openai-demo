export default function Response({ prompt, response }) {
  return (
    <div className="grid [grid-template-columns:_1fr_3fr] gap-y-2 gap-x-3 bg-zinc-100 rounded-xl shadow-md hover:scale-[1.025] hover:drop-shadow-lg px-6 py-4 transition-all duration-150">
      <h3 className="font-bold">Prompt:</h3>
      <p className="font-light">{prompt}</p>
      <h3 className="font-bold">Response:</h3>
      <p className="font-light font-mono">{response}</p>
    </div>
  )
}
