import { Layout } from "../UI/Layout";
import HeatherView from "../UI/HeatherView";
import { useLocation, useNavigate } from "react-router";


import type { Transaction } from "../Models/DataTransactions";
import { allIcons } from "../UI/allIicons";
import { useEffect, useState, type JSX } from "react";
import BlurContainer from "../UI/BlurContainer";

import { MultipleAcctionButtons } from "./addNewTransactions/Keyboard";
import { useBudgetContext } from "../provide/budget";
import { getCategoryMeta } from "../Models/dummyData"; //getCategoryMeta

import { SubCategortCardForList, SubCategory } from "./SubCategoryEddit";
import { VALID_ROUTES } from "../Routes/routes";

const TransationsDetailsView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dataReceived = location?.state?.transaction;

  const dataShow: Transaction = dataReceived;

  const [localDataToShow, setLocalDataToShow] = useState<any>({
    ...dataReceived,
  });
 

  const originalData = dataReceived;

  const { handleUpdate , handleDeleteOne , getSubCategoryFor , subcategoriesData } = useBudgetContext();
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    amount: "",
  });

  const { title, description, subcategory, date, amount, category } =
    localDataToShow;

  useEffect(() => {
    if (!localDataToShow) {
      navigate("/");
    }
  }, [localDataToShow, navigate]);

  // ================= VALIDACIÓN =================
  const validate = () => {
    const newErrors = { title: "", amount: "" };

    if (!title || title.trim() === "") {
      newErrors.title = "Title is required";
    }

    if (!amount || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);

    return !newErrors.title && !newErrors.amount;
  };

  const hasChanges =
    JSON.stringify(originalData) !== JSON.stringify(localDataToShow);

  const makeUpdate = () => {
    if (!hasChanges) return;

    const isValid = validate();
    if (!isValid) return;

    handleUpdate(localDataToShow);
    navigate("/transactions");
  };

  // ================= SUBCATEGORÍAS =================
  const updateSubCategories = (sc: any) => {
    
    if (!canEdit) return;
   

    setLocalDataToShow((prev:any) => {
      let copy = { ...prev };

      const current = copy;

      const alreadyExists = current.subcategory.includes(sc);

      const updatedSubcategories = alreadyExists
        ? current.subcategory.filter((s:any) => s !== sc)
        : [...current.subcategory, sc];

      copy = {
        ...current,
        subcategory: updatedSubcategories,
      };

      return copy;
    });
  };

  const deleteTransaction = ()=>{
    handleDeleteOne(localDataToShow)
    navigate("/transactions");
  }


    
    

  const datameta = getCategoryMeta(dataShow.type);

  return (
    <Layout>
      <div onClick={() => setCanDelete(!canDelete)}>
        <HeatherView title="Details" />
      </div>



      <section className="p-4 flex flex-col px-8 relative ">
      {canDelete &&<span className="absolute -top-11  right-8 bg-red-400 text-white font-semibold px-4 rounded-xl "  onClick={deleteTransaction}>Delete</span>}
        {/* HEADER */}
        <section
          style={{
            background: `linear-gradient(120deg, ${
              datameta.bg
            }90 0%, ${
              datameta.bg
            } 50%, ${
              datameta.bg
            }90 100%)`,
          }}
          className="w-full h-40 rounded-2xl shadow-md gap-3 flex flex-col justify-center items-center text-white"
        >
          {/* TITLE */}
          {canEdit ? (
            <>
              <input
                placeholder="v"
                value={title}
                onChange={(e) =>
                  setLocalDataToShow((prev:any) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="text-center bg-transparent border-b outline-none"
              />
              {errors.title && (
                <p className="text-red-200 text-sm">{errors.title}</p>
              )}
            </>
          ) : (
            <p>{title}</p>
          )}

          {/* AMOUNT */}
          {canEdit ? (
            <>
              <input
                placeholder="$0.00"
                type="number"
                value={amount}
                onChange={(e) =>
                  setLocalDataToShow((prev:any) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                }
                className="text-3xl text-center bg-transparent border-b outline-none"
              />
              {errors.amount && (
                <p className="text-red-200 text-sm">{errors.amount}</p>
              )}
            </>
          ) : (
            <p className="text-3xl font-extralight">$ {amount.toFixed(2)}</p>
          )}

          <p className="text-sm font-bold">
            {datameta.icon} {datameta.label }
          </p>
        </section>

        {/* BODY */}
        <section className="w-full flex flex-col overflow-auto gap-4 h-120 text-gray-700">
          <BlurContainer size={10} />

          <FrameDetail icon={allIcons.tag} title={category}>
           
            <button onClick={() => {navigate(VALID_ROUTES.subcategory , {state: {subCategory: category} });}}
            className={`"bg-gray-100 text-stone-500 font-semibold text-xl capitalize   size-6 rounded-sm border  flex items-center justify-center absolute right-2 top-2 transition-all duration-100 lineal  `}>{allIcons.plus}</button>
        
            <div className="flex flex-wrap gap-2">
              {getSubCategoryFor(category).map((subCate) => {
                const data = subcategoriesData.find((sc) => sc.title === subCate.title) || new SubCategory({id: null, title: subCate.title, icon: "", color: "", category: []}) 
  

                return(<SubCategortCardForList key={subCate.id} sc={data} editSubCategory={() => updateSubCategories(subCate.title.toLowerCase())} size="M" showColor={subcategory.includes(subCate.title.toLowerCase())}  />)

               
              })}
            </div>

            <span className="text-end text-[13px] text-gray-600">
              {String(date).split("T")[0]}
            </span>
          </FrameDetail>

          {/* DESCRIPTION */}
          <FrameDetail icon={allIcons.note} title="Note">
            <div className="border rounded-md p-1 min-h-6 border-gray-400 shadow-inner bg-gray-200 mt-1">
              {canEdit ? (
                <textarea
                  placeholder="descriptions..."
                  value={description}
                  onChange={(e) =>
                    setLocalDataToShow((prev:any) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent outline-none"
                />
              ) : (
                <p>{description}</p>
              )}
            </div>
          </FrameDetail>

         

          {/* BUTTONS */}
          <div className="absolute bottom-25 left-10 gap-2 flex">
            <MultipleAcctionButtons
              bt1={{
                title: canEdit ? "Undo" : "Edit Mode",
                action: () => {
                  if (canEdit) {
                    setLocalDataToShow(originalData);
                    setErrors({ title: "", amount: "" });
                  }
                  setCanEdit(!canEdit);
                },
              }}
              bt2={{
                title: "Update",
                action: makeUpdate,
                validator:
                  canEdit &&
                  hasChanges &&
                  !errors.amount &&
                  !errors.title,
              }}
            />
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default TransationsDetailsView;

/* ================= FRAME ================= */

const FrameDetail = ({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: JSX.Element;
  title: string;
}) => {
  return (
    <div className="w-full gap-1 rounded-2xl shadow-md p-4 flex flex-col bg-white text-gray-700 relative">
      <div className="flex gap-4">
        {icon}
        <span className="font-bold capitalize">{title}</span>
      </div>
      {children}
    </div>
  );
};