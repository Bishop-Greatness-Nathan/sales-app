import { useState, ChangeEvent, useEffect } from "react"
import { toast } from "react-toastify"
import CategoryActionModal from "../components/modals/CategoryActionModal"
import { FaTrashAlt, FaRegEdit } from "react-icons/fa"
import {
  useCategoryQuery,
  useCreateCategory,
  useDeleteCategory,
  useEditCategory,
} from "../queries/categories"

function Categories() {
  const [category, setCategory] = useState("")
  const [ID, setID] = useState("")
  const [text, setText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editFlag, setEditFlag] = useState(false)

  const { data: categories, isLoading, isError } = useCategoryQuery()

  const {
    mutate: editCategory,
    isPending: editPending,
    isSuccess: editSuccess,
    isError: editError,
  } = useEditCategory()

  const {
    mutate: createCategory,
    isPending: createPending,
    isSuccess: createSuccess,
    isError: createError,
  } = useCreateCategory()

  const {
    mutate: delCategory,
    isSuccess: deleteSuccess,
    isError: deleteError,
    isPending: deletePending,
  } = useDeleteCategory()

  // submit form
  const submitCategory = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editFlag) {
      editCategory({ id: ID, name: category })
      return
    } else {
      createCategory(category)
    }
  }

  // delete category
  const deleteCategory = async () => {
    delCategory(ID)
    setText("Deleting... Please wait")
  }

  useEffect(() => {
    if (createSuccess) {
      toast.success("new category added")
      setCategory("")
      return
    } else if (createError) {
      toast.error("there was an error")
      return
    }
  }, [createSuccess, createError])

  useEffect(() => {
    if (editSuccess) {
      toast.success("category edited")
      setCategory("")
      setID("")
      setEditFlag(false)
      return
    } else if (editError) {
      toast.error("there was an error")
      return
    }
  }, [editSuccess, editError])

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("category deleted")
      setShowModal(false)
      setText("")
      return
    } else if (deleteError) {
      toast.error("there was an error")
      setShowModal(false)
      return
    }
  }, [deleteSuccess, deleteError])

  if (isLoading)
    return (
      <h1 className='text-xl font-semibold text-center mt-5'>
        Loading Categories...
      </h1>
    )
  if (isError)
    return (
      <h1 className='text-xl font-semibold text-center mt-5'>
        There was an error...
      </h1>
    )
  return (
    <main className='mt-10 rounded p-2 md:p-5 shadow-md shadow-slate-300 bg-white'>
      {/* TITLE */}
      <h1 className='font-semibold text-center text-base md:text-xl'>
        Categories
      </h1>

      {/* FORM */}
      <form
        onSubmit={submitCategory}
        className='mt-3 flex items-center border border-[var(--primary)] rounded'
      >
        <input
          type='text'
          name='category'
          className='w-[80%] border-0 outline-none p-1 rounded'
          placeholder='enter new category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          className={`bg-[var(--primary)] w-[20%] text-white p-1 border border-[var(--primary)] ${
            (createPending && "cursor-wait bg-[var(--hoverColor)]") ||
            (editPending && "cursor-wait bg-[var(--hoverColor)]")
          }`}
          disabled={createPending || editPending}
        >
          {editFlag ? "edit" : "save"}
        </button>
      </form>

      {/* CATEGORIES */}
      <section className='mt-5'>
        {categories && categories.length < 1 ? (
          <h2 className='text-center'>You have no saved categories</h2>
        ) : (
          <div>
            {categories?.map((category) => {
              return (
                <div
                  key={category._id}
                  className='flex justify-between items-center bg-[var(--hoverColor)] mb-1 p-1 rounded text-xs md:text-base'
                >
                  <p>{category.name}</p>
                  <div className='flex justify-center space-x-3 md:space-x-5'>
                    <button
                      disabled={deletePending}
                      className={`text-[var(--primary)] hover:text-white ${
                        deletePending && "cursor-wait"
                      }`}
                      onClick={() => {
                        setID(category._id)
                        setCategory(category.name)
                        setEditFlag(true)
                      }}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className={`text-[var(--primary)] hover:text-white ${
                        deletePending && "cursor-wait"
                      }`}
                      disabled={deletePending}
                      onClick={() => {
                        setShowModal(true)
                        setText(
                          "This action cannot be reversed. Do you wish to proceed?"
                        )
                        setID(category._id)
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      {showModal && (
        <CategoryActionModal
          text={text}
          action={deleteCategory}
          setShowModal={setShowModal}
        />
      )}
    </main>
  )
}

export default Categories
