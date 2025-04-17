"use client"

import { deleteTour } from "@/services/api";
import {useParams} from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DeleteConfirmPage = () => {

    const params = useParams();
    const tourId = params.id
    const router = useRouter()

    useEffect(()=>{

        const deleteTourFunc = async()=>{
            try{
                const response = await deleteTour(tourId)
                console.log("Tour deleted successfully", response)
                router.push("/admin/tours")
            }catch(err){
                console.error("Error deleting tour",err)
                new Error("Ошибка при удалении тура")
            }
        }

        deleteTourFunc()
    },[tourId])

  return (
    <></>
  )
}

export default DeleteConfirmPage