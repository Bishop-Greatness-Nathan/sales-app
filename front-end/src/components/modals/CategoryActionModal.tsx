function CategoryActionModal({
  text,
  action,
  setShowModal,
}: {
  text: string
  action: () => void
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <main className='blured-bg fixed top-0 left-0 flex justify-center items-center w-full h-full z-10'>
      <div className='bg-[whitesmoke] rounded shadow-md shadow-[var(--primary)] w-[300px] lg:w-[500px] p-3'>
        <p className='text-center'>{text}</p>

        <div className='flex justify-center space-x-4 mt-4'>
          <button
            disabled={text === "Deleting... Please wait"}
            className={`bg-[var(--primary)] py-1 px-2 text-white rounded hover:bg-[var(--hoverColor)] ${
              text === "Deleting... Please wait" && "cursor-wait"
            }`}
            onClick={() => action()}
          >
            Proceed
          </button>
          <button
            disabled={text === "Deleting... Please wait"}
            className={`bg-[var(--primary)] py-1 px-2 text-white rounded hover:bg-[var(--hoverColor)] ${
              text === "Deleting... Please wait" && "cursor-wait"
            }`}
            onClick={() => setShowModal(false)}
          >
            Decline
          </button>
        </div>
      </div>
    </main>
  )
}

export default CategoryActionModal
