function Button(handleclick, value, title) {
    return (
        <button onClick={handleclick} value={value} className="">
            {title}

        </button>
    )
}
export default Button;