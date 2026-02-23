function Button(handleclick, value, title) {
    return (
        <button onClick={handleclick} value={value} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
             {title}
        </button>
    )
}
export default Button;