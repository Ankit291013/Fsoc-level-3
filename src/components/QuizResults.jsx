"use client";

import { jsPDF } from "jspdf";

const QuizResults = ({ score, totalQuestions, onRestart, onBackToSetup }) => {
    const percentage = Math.round((score / totalQuestions) * 100);

    const getResultMessage = () => {
        if (percentage >= 90)
            return {
                message: "Outstanding! 🏆",
                emoji: "🎯",
                color: "text-yellow-600",
            };
        if (percentage >= 80)
            return {
                message: "Excellent! 🌟",
                emoji: "⭐",
                color: "text-green-600",
            };
        if (percentage >= 70)
            return {
                message: "Great Job! 👏",
                emoji: "👍",
                color: "text-blue-600",
            };
        if (percentage >= 50)
            return {
                message: "Good Effort! 💪",
                emoji: "👌",
                color: "text-purple-600",
            };
        return {
            message: "Keep Trying! 📚",
            emoji: "💪",
            color: "text-red-600",
        };
    };

    const result = getResultMessage();

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFillColor(139, 92, 246);
            doc.rect(0, 0, 210, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text("Quiz Results", 105, 20, { align: 'center' });

            doc.setTextColor(0);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');

            doc.setFillColor(230, 230, 250);
            doc.roundedRect(15, 40, 180, 60, 5, 5, 'F');

            doc.setTextColor(75, 0, 130);
            doc.setFontSize(18);
            doc.text(`Score: ${score} / ${totalQuestions}`, 25, 60);
            doc.text(`Percentage: ${percentage}%`, 25, 75);
            doc.text(`Result: ${result.message.replace(/[^\x20-\x7F]/g, "")}`, 25, 90);

            const now = new Date();
            doc.setFontSize(12);
            doc.setTextColor(50);
            doc.text(`Date: ${now.toLocaleDateString()}`, 25, 110);
            doc.text(`Time: ${now.toLocaleTimeString()}`, 110, 110);

            doc.setFontSize(10);
            doc.setTextColor(120);
            doc.text("Thank you for participating!", 105, 280, { align: 'center' });

            doc.save("quiz-results.pdf");
        } catch {
            alert("Oops! Failed to generate PDF. Please try again.");
        }
    };

    const handleShareTwitter = () => {
        const text = encodeURIComponent(
            `I scored ${score}/${totalQuestions} (${percentage}%) - ${result.message} in this quiz! If you want to try more quizzes , Try it yourself:`
        );
        const url = encodeURIComponent("https://opentdb.com/");
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            "_blank",
            "width=600,height=400"
        );
    };

    const handleShareFacebook = () => {
        const url = encodeURIComponent("https://opentdb.com/");
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            "_blank",
            "width=600,height=400"
        );
    };

    const handleCopyLink = () => {
        const shareUrl = `${window.location.href}?score=${score}&total=${totalQuestions}&percent=${percentage}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Shareable link copied to clipboard!");
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform animate-pulse">
                <div className="text-8xl mb-6 animate-bounce">{result.emoji}</div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                        {score}/{totalQuestions}
                    </div>
                    <div className="text-xl text-gray-600 mb-4">{percentage}% Correct</div>

                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg
                            className="w-32 h-32 transform -rotate-90"
                            viewBox="0 0 120 120"
                        >
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#8b5cf6"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${(percentage / 100) * 314} 314`}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-purple-600">{percentage}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{score}</div>
                        <div className="text-sm text-green-700">Correct</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                            {totalQuestions - score}
                        </div>
                        <div className="text-sm text-red-700">Incorrect</div>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <button
                        onClick={onRestart}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        data-quiz-restart="true"
                    >
                        🔄 Try Again
                    </button>

                    <button
                        onClick={onBackToSetup}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        ⚙️ Back to Setup
                    </button>

                    <button
                        onClick={() => window.open("https://opentdb.com/", "_blank")}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        🌐 More Quizzes
                    </button>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-3">Share your results:</p>
                    
                    <div className="space-y-3">
                        <button
                            onClick={handleDownloadPDF}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            📄 Download PDF
                        </button>

                        <button
                            onClick={handleShareTwitter}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            🐦 Share on Twitter
                        </button>

                        <button
                            onClick={handleShareFacebook}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            📘 Share on Facebook
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
                        >
                            🔗 Copy Shareable Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;