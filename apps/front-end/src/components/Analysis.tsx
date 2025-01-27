import { useDashboardContext } from "../pages/DashboardLayout"
import { AnalysisType } from "../utils/types"

function Analysis({ analysis }: { analysis: AnalysisType }) {
  const { currentUser } = useDashboardContext()

  return (
    <div className='w-[50%] lg:w-[40%] text-[8px] md:text-sm lg:text-base border border-[whitesmoke] rounded bg-white mb-5'>
      <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
        <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
          TOTAL AMOUNT
        </span>
        <span className='p-1'>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format((analysis.total as number) || 0)}
        </span>
      </h2>
      <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
        <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
          CASH
        </span>
        <span className='p-1'>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format((analysis.totalCash as number) || 0)}
        </span>
      </h2>
      <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
        <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
          BANK
        </span>
        <span className='p-1'>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format((analysis.totalBank as number) || 0)}
        </span>
      </h2>
      <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
        <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
          USED POINTS
        </span>
        <span className='p-1'>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format((analysis.usedPoints as number) || 0)}
        </span>
      </h2>
      <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
        <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
          TOTAL RETURNED
        </span>
        <span className='p-1'>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format((analysis.totalReturned as number) || 0)}
        </span>
      </h2>
      {currentUser.role === "admin" && (
        <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
          <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
            GROSS PROFIT
          </span>
          <span className='p-1'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(analysis.grossProfit || 0)}
          </span>
        </h2>
      )}
      {currentUser.role === "admin" && (
        <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
          <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
            EXPENSES
          </span>
          <span className='p-1'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(analysis.expenses || 0)}
          </span>
        </h2>
      )}
      {currentUser.role === "admin" && (
        <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
          <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
            POINTS
          </span>
          <span className='p-1'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(analysis.points || 0)}
          </span>
        </h2>
      )}
      {currentUser.role === "admin" && (
        <h2 className='grid grid-cols-2 gap-2 border border-b-[whitesmoke]'>
          <span className='border border-l-0 border-t-0 border-b-0 border-r-[whitesmoke] p-1'>
            NET PROFIT
          </span>
          <span className='p-1'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(analysis.netProfit || 0)}
          </span>
        </h2>
      )}
    </div>
  )
}

export default Analysis
