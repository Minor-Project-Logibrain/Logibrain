export default function Loading({ size = "medium", fullScreen = false }) {
    const sizes = {
        small: {
            container: "h-10",
            spinner: "w-5 h-5 border-2",
        },
        medium: {
            container: "h-20",
            spinner: "w-8 h-8 border-4",
        },
        large: {
            container: "h-40",
            spinner: "w-12 h-12 border-4",
        },
    };

    const currentSize = sizes[size] || sizes.medium;

    return (
        <div
            className={`flex justify-center items-center ${fullScreen ? "fixed inset-0" : currentSize.container
                }`}
        >
            <div
                className={`${currentSize.spinner} border-gray-300 border-t-blue-600 border-r-purple-600 rounded-full animate-spin`}
            ></div>
        </div>
    );
}