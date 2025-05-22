
import Header from "@/components/header/Header";
import CustomSlider from "@/components/slider/Slider";
import LoginPage from "@/features/login/LoginPage";

export default function Home() {
    return (
        <>
            <Header />
            {/* <LoginPage /> */}
            <div className="w-full">
                <CustomSlider />
            </div>
        </>
    );
}
