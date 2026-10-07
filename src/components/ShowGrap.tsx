
import { useBudgetContext } from "../provide/budget";
import { Layout } from "../UI/Layout";
// import { useLocation } from "react-router";
import SelectorMultipleUI from "../UI/SelectorMultipleUI";
import { useState } from "react";
import type { ISummaryHomeData, } from "../provide/hooks/useSummaryTransactions";

import { validateSavingDataToShow, type TKEY_SUMMARY } from "../provide/hooks/useSummaryTransactions";
import { DataShowListCategory } from "../UI/DataShowListCategory";
import ShowBarData from "./ShowBarData";


const ShowGrap = () => {
  // const location = useLocation();
  const { curentDate, allMonthsData , lastMonth , acumulateMonth  ,global, stocksProfit ,getDataMonthToShow } = useBudgetContext();
  const [monthToShowString, setMonthToShowString] = useState<string>(lastMonth);

 

  const globalData = Object.entries(global).map(([category, cuantity]) => ({ category, cuantity })
  ).filter(e => validateSavingDataToShow.includes(e.category as TKEY_SUMMARY))
 


const searchDataMonth = (search: "Current" | "Last") => {
  const isCurrentMonth = search === "Current";
  const prebData = Object.keys(acumulateMonth)

 
  if (isCurrentMonth && prebData.includes(monthToShowString))  {
    return  getDataMonthToShow(acumulateMonth[monthToShowString])
  }

  

  if (isCurrentMonth && !prebData.includes(monthToShowString)) {
   
    const data = acumulateMonth[prebData[prebData.length - 1]]
    return getDataMonthToShow(data)
  }

  if (!isCurrentMonth ) {
    const indexLastMonth = prebData.indexOf(monthToShowString);
    const dataLastMonth = prebData[indexLastMonth - 1];    
    if (!dataLastMonth) return emptyData()
    return getDataMonthToShow(acumulateMonth[dataLastMonth])
   
  }

  return  emptyData()


};



  const dataCurrentMonth = searchDataMonth( "Current")

  const dataOldMonth = searchDataMonth("Last")
  const moreData = [{category: 'ForStocksProfit', cuantity: stocksProfit} ,{category: 'Balance', cuantity: global.totalBalance},{category: 'Cash', cuantity: global.totalCash}]
  const dataToShow = [...moreData, ...globalData]
  
  console.log(dataCurrentMonth)

  const totalAvailable = dataToShow.reduce((acc, item) => acc + item.cuantity, 0);
  return(
    <Layout>
      <div className="sticky top-0  bg-white p-4 ">
        <div className="flex flex-row gap-4 pl-2 pt-4  relative  items-center  ">
          <h3 className="text-3xl font-bold ">Trend { curentDate.year}</h3>
          <h6 className="text-3xl font-light text-gray-600 "> </h6>
        </div> 
      </div>
      <section className="flex flex-col overflow-scroll w-93 sm:w-180   mb-4 h-170 pt-4  gap-4  mx-auto    bg-gsray-800 ">
           
        <SelectorMultipleUI
          data={allMonthsData}
          year={curentDate.year}
          selectCurrentType={setMonthToShowString}
          defaultTypeTransaction={monthToShowString} />

        <div className="flex flex-col sm:w-180 sm:flex-row-reverse sm:px-4 gap-4">
        <CardMonthData title={"Current Month"} data={dataCurrentMonth} />
        <CardMonthData title={"Last Month"} data={dataOldMonth} />
        </div>
        
        <div className="flex flex-col w-93 mt-20  mx-auto">
           <ShowBarData  />
          <p className="text-xl font-bold pl-20 ">Total Available: {totalAvailable.toFixed(2)}</p>
        <DataShowListCategory title="Globals Savings" sizeScroll={100} data={dataToShow} valueSort={true} setSortToggle={() => { }} />
      
        </div>
   
    
        </section>

    </Layout>
    )
};

export default ShowGrap; 








const CardMonthData = ({title ,data}: {title: string ,data: any}) => {
  


  return (
      <section className="w-full h-60 bg-white rounded-2xl shadow-md p-3  mb-2 ">
      <h2 className="text-lg font-bold mb-1  " >{title}</h2>
      {
        Object.keys(data).map((f, i) => (
          <RowDataShow key={i + title + f} title={f} data={data[f]} />
        ))
        }



          
        </section>
  )
}


const RowDataShow = ({title ,data}: {title: string , data: {name: string, value: string}[]}) => {
  return(
    <div className="mb-1  ">
      <p className="text-md font-semibold  border-b border-gray-400 uppercase " >{title}</p>
      <div className="grid grid-cols-2 ">
        {
          data.map((f, i) => {
            const value = Number(f.value) ? Number(f.value).toFixed(2) : f.value

            return(
          <p key={i + title + f} className="flex flex-row text-gray-900  pl-3 pr-2 items-center justify-between mt-px text-sm " >
            <span className=" ">{f.name}:</span>
            <span className="" >{value}</span>
          </p>
        )})
        }
      </div>

    </div>
  )
}

const emptyData = () => {
  const nodata = "x,xxx.xx";
  return {
    Savings: [{ name: "Balance", value: nodata }, { name: "Cash", value: nodata }],
    ["Credits Cards"]: [
      { name: "Red Card", value: nodata },
      { name: "Blue Card", value: nodata },
    ],
    ["Savings & Investments"]: [
      { name: "Savings", value: nodata },
      { name: "Mortgage", value: nodata },
      { name: "Stocks", value: nodata },
      { name: "Crypto", value: nodata },
    ],
  };
};



