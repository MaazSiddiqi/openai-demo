// @ts-nocheck
import { useEffect, useState } from "react"
import "./App.css"
import Response from "./components/response"

const samplePrompts = [
  "What is the future of AI?",
  "Do you think AI can replace human labor?",
  "How old are you?",
  "What is your favourite programming language?",
  "Should I code ReactJS websites with Javascript or Typescript",
  "What came first, the chicken or the egg?",
]

function App() {
  const [prompt, setPrompt] = useState("")
  const [responses, setResponses] = useState()
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    const savedResponses = localStorage.getItem("responses")
    savedResponses ? setResponses(JSON.parse(savedResponses)) : setResponses([])
  }, [])

  useEffect(() => {
    responses && localStorage.setItem("responses", JSON.stringify(responses))
  }, [responses])

  const request = async (prompt) => {
    const payload = {
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    }

    const _res = await fetch(
      "https://api.openai.com/v1/engines/text-curie-001/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
        },
        body: JSON.stringify(payload),
      },
    ).catch((err) => console.log(err))

    // @ts-ignore
    const data = _res ? await _res.json() : "Failed Request"
    const response = data["choices"][0]["text"]

    setResponses((prev) => [{ prompt, response }, ...prev])
    setPrompt("")
    setFetching(false)
  }

  return (
    <main className="grid items-center">
      <div className="w-2/3 place-self-center py-16 space-y-6">
        <h1 className="font-bold text-3xl">Fun with AI</h1>
        <form
          onSubmit={(e) => {
            if (fetching) return
            e.preventDefault()
            setFetching(true)
            prompt !== "" && request(prompt.trim())
          }}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="pl-2 font-semibold">Enter Prompt</h2>
            <select
              onChange={(e) => {
                setPrompt(e.target.value)
                e.target.value = ""
              }}
              className="text-md p-2 font-light rounded-xl shadow-md hover:active focus:active focus-within:active active:scale-95 transition-all duration-150"
            >
              <option value="">Presets</option>
              {samplePrompts.map((_prompt) => (
                <option value={_prompt}>{_prompt}</option>
              ))}
            </select>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-[20rem] min-h-[10rem] max-h-[50vh] resize-y text-md p-4 font-light rounded-xl shadow-md hover:active focus:active focus-within:active focus-within:ring-0 focus-within:ring-offset-0 transition-all duration-150"
            placeholder="Send a message to OpenAi!"
          />

          <button
            type="submit"
            className="grid place-items-center w-full rounded-full shadow-md text-white p-3 font-semibold bg-blue-500 hover:active active:scale-95 transition-all duration-150"
          >
            {!fetching ? (
              "Submit"
            ) : (
              <div className="loader h-6 w-6 aspect-square"></div>
            )}
          </button>
        </form>
        <h2 className="font-bold text-2xl">Responses</h2>
        <div className="space-y-4">
          {responses &&
            // @ts-ignore
            responses.map((response, idx) => (
              <Response id={idx} {...response} />
            ))}
        </div>
      </div>
    </main>
  )
}

export default App
