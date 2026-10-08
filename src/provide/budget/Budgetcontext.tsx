import {
  
  useEffect,
 
  useRef,
 
  useState,
 
  type ReactElement,
} from "react";
import { BudgetContext } from "./data";
import {        GoogleSheetsServiciesTransactions, SummaryData } from "../../Services/Servicies";
import { Transaction } from "../../Models/DataTransactions";

import { useSummary, type ISummaryHomeData } from "../hooks/useSummaryTransactions";
import { goalsDataDefault, type TKEY_GOALS, type TKEY_MONTHS } from "../interfaces";
import { GoogleSheetsServiciesSubCategories,  type IServiciesDBSubCategories } from "../../Services/ServiciesSubCategory";
import type { SubCategory } from "../../components/SubCategoryEddit";
// import { settings } from "../../api";


export interface IBudgetContext {
  title: string;
  isLoading: boolean
  transactionsData: Transaction[]
  subcategoriesData: SubCategory[]
  saveSubCategories: (data: SubCategory[]) => void 
  saveNewTransaction: (data: Transaction, action?: () => void) => void
  handleDelete: () => void
  handleBackup: () => void
  summaryHomeData: ISummaryHomeData
  currentMonthKey: string
  changeMountToShow: (action: "<" | ">") => void
  allMonthsData:string[]
  saveMultipleTransaction:(data:Transaction[] ,action?:()=>void)=>void
  handleUpdate:(data:Transaction)=>void
  handleDeleteOne: (data: Transaction) => void
  udateLocalDataBase: () => void
  saveStocksProfit: (cuantity: number) => void
  validateStockFound:(cuantity: number) => boolean
  validateCashFound:(cuantity?: number) => boolean
  validateSavingsAccountBalance: (cuantity?: number) => boolean
  getSubCategoryFor: (category: string) => SubCategory[]
  stocksProfit: number
  global: ISummaryHomeData
  curentDate:{
    year: string,
    month: number,
    nameMonth: string
  }
  validateBalance: (amount?: number) => boolean
  validateMortgageFound: (amount?: number) => boolean
  validateCryptoFound:(cuantity: number) =>  boolean
 
  validatePaymentCard: (card: string, cuantity: number , acction:(newAmount: string)=>void) => boolean
  // setTransactionsData: Dispatch<Transaction[]>
  // setIsLoading: Dispatch<boolean>
  currentMonthGoals: Record<TKEY_GOALS, number>
  lastMonth: string
  allMonthsDataSort: Record<string, ISummaryHomeData>
  acumulateMonth: Record<string, ISummaryHomeData>
  getDataMonthToShow: (data?: ISummaryHomeData) => any
}


  
const goalsMonthly: TKEY_MONTHS = {

    
 }


export const BudgetContextProvider = ({ children }: { children: ReactElement }) => {
  const [isLoading, setIsLoading] = useState(true )
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([])
  const [subcategoriesData, setSubcategoriesData] = useState<SubCategory[]>([])
  const hasRun = useRef(false);

  const stored = typeof window !== "undefined"
    ? window.localStorage.getItem("stocksProfit")
    : 100
  const [stocksProfit, setStocksProfit] = useState(parseInt(stored as string, 10) || 10)

  
  const { global, monthly, lastMonth, allMonthsData , acumulateMonth
 } = useSummary(transactionsData);
  
  const [currentMountIndex, setCurrentMountIndex] = useState(allMonthsData.findIndex((f) => f === lastMonth))


  const currentMonthKey = allMonthsData[currentMountIndex] || lastMonth
  

  
  
  const currentMonthGoals = goalsMonthly[currentMonthKey || lastMonth ] ?? goalsDataDefault

  const summaryHomeData = monthly[currentMonthKey]
  

  const getSubCategoryFor = (category: string) => {
    return subcategoriesData.filter((f) => f.category.includes(category)) 
  }
 


  const validateBalance = (cuantity: number = 0) => {
    return global?.totalBalance > cuantity
  }
   const validateSavingsAccountBalance = (cuantity: number = 0) => {
    return global?.savingsBank > cuantity
  }

  const validateMortgageFound = (cuantity: number = 0) => {

    return global?.savingsMortgage > cuantity
  }
   const validateStockFound = (cuantity: number = 0) => {

    return global?.savingsStocks >= cuantity
  }
  const validateCryptoFound = (cuantity: number = 0) => {

    return global?.savingsCrypto >= cuantity
  }


  const validateCashFound = (cuantity: number = 0) => {
   
    return global?.totalCash >= cuantity
  }
  const validatePaymentCard = (card: string, cuantity: number = 0, acction: (newAmount: string) => void): boolean => {
    
    if (card === "credit_card_blue") {
      acction(global?.totalCardBlue.toString())
      return global?.totalCardBlue >= cuantity
    } else {
      acction(global?.totalCardRed.toString())
      return global?.totalCardRed >= cuantity
    }

  }
   const getDataMonthToShow = (data?: ISummaryHomeData) => {

    if (!data) return;
   
    const {
    totalBalance,
    totalCardRed,
    totalCardBlue,
    savingsMortgage,
    savingsBank,
    savingsStocks,
      savingsCrypto,
    totalCash,
    } = data;
  
 

  return {
    Savings: [{ name: "Balance", value: totalBalance } ,{ name: "Cash", value: totalCash }],
    ["Credits Cards"]: [
      { name: "Red Card", value: totalCardRed },
      { name: "Blue Card", value: totalCardBlue },
    ],
    ["Savings & Investments"]: [
      { name: "Savings", value: savingsBank },
      { name: "Mortgage", value: savingsMortgage },
      { name: "Stocks", value: savingsStocks },
      { name: "Crypto", value: savingsCrypto },
    ],
  };
  };

   const changeMountToShow = (action: "<" | ">") => {
    if (action === "<") {
      setCurrentMountIndex((prev) => prev - 1 < 0 ? 0 : prev - 1)
    } else {
      setCurrentMountIndex((prev) => prev + 1 > allMonthsData.length - 1 ? allMonthsData.length - 1 :  prev + 1)
    }
    
  }

  
  const dataBase =new GoogleSheetsServiciesTransactions() // new ServiciesLocalTransactions()  //
  const dataBaseSubCategories:IServiciesDBSubCategories = new GoogleSheetsServiciesSubCategories() // new ServiciesLocalSubCategories() //

  useEffect(() => {
    if (hasRun.current) return;

  hasRun.current = true;

    dataBaseSubCategories.getSheetData().then((data) => {
      setSubcategoriesData(data || [])
    })

    // setIsLoading(true)
    dataBase.getSheetData().then((data) => {
      
       setIsLoading(false)
       setTransactionsData(data || [])
      
      
    
    })
   
  }, [])


  useEffect(() => { 

    const dataMonth = getDataMonthToShow(acumulateMonth[lastMonth]) || {}
 
    
    if (Object.keys(dataMonth).length > 0)
    {
      SummaryData.saveData(acumulateMonth[lastMonth])
    }
      
  },[transactionsData,acumulateMonth,lastMonth])


  const saveStocksProfit = (cuantity: number) => {
    localStorage.setItem("stocksProfit", cuantity.toString())
    setStocksProfit(cuantity)
  }

  const saveSubCategories = (data: SubCategory[]) => {
    setIsLoading(true)
    dataBaseSubCategories.handleUpdate(data).then(() => {
      setSubcategoriesData(data)
      setIsLoading(false)
    })
  }

  const udateLocalDataBase = () => {
    setIsLoading(true)
    dataBaseSubCategories.handleBackup(subcategoriesData).then(() => {
       setIsLoading(false)
    })
      
    
 }

  const handleDelete = () => {
    return;
   dataBase.handleDelete().then((data) => {
   
     if (data) {
       window.location.reload()
      setTransactionsData([])
    }
   })
  }
  const saveMultipleTransaction = (data: Transaction[], action?: () => void) => {
    setIsLoading(true)
    const newTransactions = [...transactionsData, ...data]
    setTransactionsData(newTransactions)
   setIsLoading(false)
    dataBase.handleBackup(newTransactions).then(() => {
     
      if (action) {
        action()
      }
    })
    
  }

    useEffect(() => { 


 
    
      // console.log('transactionsData', acumulateMonth[lastMonth]);
      SummaryData.saveData(acumulateMonth[lastMonth])
      
      
  },[transactionsData])

  const saveNewTransaction = (data: Transaction, action?: () => void) => {
    const newData = new Transaction(data)

    setIsLoading(true)
    const newTransactions = [...transactionsData, newData]
    setTransactionsData(newTransactions)
    setIsLoading(false)
    if (action) {
        action()
    }
    

    dataBase.sendSheetDataTransaction(newTransactions).then(() => {
      
    })
    return false
  }

  const handleBackup = () => {
   
    dataBase.handleBackup(transactionsData)
  

  }
  const handleUpdate=(data:Transaction)=>{

     const newTransactions = [...transactionsData.filter(t => t.id != data.id), new Transaction(data)]
    setTransactionsData(newTransactions)
   
        dataBase.handleUpdate(newTransactions)

  }



  const handleDeleteOne = (data: Transaction) => {
  

     const newTransactions = [...transactionsData.filter(t => t.id != data.id)]
        setTransactionsData(newTransactions)
        dataBase.handleDeleteOne(newTransactions)

  }


     const [year, month] = currentMonthKey.split("-").map(Number);
  
  const nameMonth = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });

  const curentDate = {
    year: year.toString(),
    nameMonth: nameMonth,
    month: month - 1,
  }


 






  const values = {
    title: "this is a test",

    isLoading,
    transactionsData,
    saveNewTransaction,
    summaryHomeData,
    currentMonthKey,
    curentDate, changeMountToShow,
    global, validateBalance,
    validateMortgageFound,
    currentMonthGoals,
    validatePaymentCard,
    handleDelete,
    allMonthsData,
    lastMonth,
    allMonthsDataSort: monthly,
    acumulateMonth,
    handleBackup, saveMultipleTransaction, handleUpdate, handleDeleteOne,
    udateLocalDataBase,
    validateSavingsAccountBalance,
    subcategoriesData, saveSubCategories, getSubCategoryFor, stocksProfit, saveStocksProfit,
    validateCryptoFound,validateStockFound,validateCashFound,
    getDataMonthToShow

  }

  return (
     <BudgetContext.Provider value={values}> {children} </BudgetContext.Provider>
  ) 
}

