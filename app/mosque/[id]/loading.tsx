import { Loader } from "lucide-react";

const Loading  = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center">
            <div>
                <Loader className="h-6 w-6 text-muted-foreground animate-spin mb-4"/>
            </div>
        </div>
    );
};

export default Loading;