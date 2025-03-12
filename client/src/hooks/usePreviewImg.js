import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const showToast = useShowToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
       
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result);
            }

            reader.readAsDataURL(file);
        }else {
            showToast("Formato de arquivo inválido", "Por favor, selecione uma imagem", "error");
            setImageUrl(null);
        }
    } 
    return {imageUrl, handleImageChange, setImageUrl}
}

export default usePreviewImg;