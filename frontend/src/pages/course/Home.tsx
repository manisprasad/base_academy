
import { useAuth } from "@/hooks/useAuth"



export const Home = () => {
    const auth = useAuth();
    console.log(auth)
    return (
        <div>Hello to home</div>
    )
}