"use client";

import { useEffect, useState } from "react";
import BadgeManager from "../utils/BadgeManager";
import AchievementNotification from "./AchievementNotification";
import QuizReview from "./QuizReview";
import { jsPDF } from "jspdf";

const QuizResults = ({ 
    score, 
    totalQuestions, 
    onRestart, 
    onBackToSetup, 
    quizData = {},
    questions = [],
    userAnswers = [],
    questionRatings = []
}) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const [newBadges, setNewBadges] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        BadgeManager.initializeBadgeSystem();

        const earnedBadges = BadgeManager.onQuizCompleted({
            score,
            totalQuestions,
            timeSpent: quizData.timeSpent || 0,
            averageTimePerQuestion: quizData.averageTimePerQuestion || 30,
        });

        if (earnedBadges.length > 0) {
            setNewBadges(earnedBadges);
            setShowAchievements(true);
        }
    }, [score, totalQuestions, quizData]);

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

    // Calculate average rating
    const averageRating = questionRatings.length > 0 
        ? (questionRatings.reduce((sum, r) => sum + r, 0) / questionRatings.length).toFixed(1)
        : null;

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
            doc.text(`Result: ${result.message.replace(/[^\x20-\x7E]/g, "")}`, 25, 90);

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
            `I scored ${score}/${totalQuestions} (${percentage}%) - ${result.message} in this quiz! If you want to try more quizzes, Try it yourself:`
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

    const handleReviewAnswers = () => {
        setShowReview(true);
    };

    const handleBackFromReview = () => {
        setShowReview(false);
    };

    // If showing review, render QuizReview component
    if (showReview) {
        return (
            <QuizReview
                questions={questions}
                userAnswers={userAnswers}
                onBack={handleBackFromReview}
            />
        );
    }

    return (
        <>
            {showAchievements && (
                <AchievementNotification
                    badges={newBadges}
                    onClose={() => setShowAchievements(false)}
                    onViewAll={() => {
                        setShowAchievements(false);
                    }}
                />
            )}
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-2 sm:p-4 md:p-6">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full text-center">

                    <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">
                        {result.emoji}
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                        Quiz Complete!
                    </h2>

                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 mb-2">
                            {score}/{totalQuestions}
                        </div>
                        <div className="text-lg sm:text-xl text-gray-600 mb-4">
                            {percentage}% Correct
                        </div>

                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
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
                                <span className="text-xl sm:text-2xl font-bold text-purple-600">
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Average Rating Display */}
                    {averageRating && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-200">
                            <p className="text-sm text-purple-700 font-medium mb-2">
                                Overall Question Rating
                            </p>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-4xl font-bold text-purple-600">
                                    {averageRating}
                                </span>
                                <span className="text-3xl">⭐</span>
                            </div>
                            <div className="flex justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span 
                                        key={star}
                                        className={`text-xl ${
                                            star <= Math.round(averageRating)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">
                                Based on {questionRatings.length} question{questionRatings.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}

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
                            onClick={handleReviewAnswers}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            📝 Review Answers
                        </button>

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
                    </div>

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
        </>
    );
};

export default QuizResults;