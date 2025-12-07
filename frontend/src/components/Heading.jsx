export const Heading = ({textValue}) => {
  return (
    <div className="text-5xl text-center md:text-6xl bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text animate-pulse">
        <h1>{textValue}</h1>
    </div>
  )
}
