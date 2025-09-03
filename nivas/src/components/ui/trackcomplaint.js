export function TrackComplaint() {
    return (
        <div>
              <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">

                <main className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
                    <center>
                        <h1 className="text-3xl font-extrabold mb-1 text-center">Track Your Complaint</h1>
                    </center>
                    <p className="text-center text-gray-600 mb-8">Enter your complaint ID to view the current status and progress of your infrastructure report.</p>


                    <form onSubmit={handleSubmit} id="complaintForm" className="max-w-xl mx-auto mb-6">
                        <label htmlFor="complaintIdInput" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Complaint ID
                            <span className="text-gray-400 font-normal text-xs">(e.g., CF-123456) to view the current status and progress.</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="complaintIdInput"
                                value={complaintId}
                                onChange={(e) => setComplaintId(e.target.value)}
                                placeholder="CF-123456"
                                className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                autoComplete="off"
                                spellCheck="false"
                            />
                            <button type="submit" aria-label="Track complaint button" className="inline-flex items-center bg-black text-white font-semibold rounded-md px-4 py-2 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1">
                                Track
                            </button>
                        </div>
                        <p className="mt-3 text-sm text-center text-gray-500">Try these demo complaint IDs</p>
                        <div className="mt-2 flex justify-center gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setComplaintId("CF-123456")}
                                className="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                            >
                                CF-123456
                            </button>
                            <button
                                type="button"
                                onClick={() => setComplaintId("CF-789012")}
                                className="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                            >
                                CF-789012
                            </button>
                            <button
                                type="button"
                                onClick={() => setComplaintId("CF-345678")}
                                className="demo-id-btn cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                            >
                                CF-345678
                            </button>
                        </div>
                    </form>

                    

                </main>

            </div>
        </div>

    )
}