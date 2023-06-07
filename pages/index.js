import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import { format } from "date-fns";
import DropDown from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState();
    const [reward, setReward] = useState("1X");
    const [generatedRewards, setGeneratedRewards] = useState("");

    const checkRewards = e => {
        e.preventDefault();
        setLoading(true);

        if (!amount) {
            setLoading(false);
            return toast.error("Please enter a valid amount");
        }

        const spendThreshold = 200; // Threshold amount for earning reward points
        const rewardRate = {
            "1X": 12, // Reward points earned per multiple of the spend threshold for 1X
            "3X": 36, // Reward points earned per multiple of the spend threshold for 3X
            "5X": 60, // Reward points earned per multiple of the spend threshold for 5X
            "10X": 120 // Reward points earned per multiple of the spend threshold for 10X
        };

        const multiples = Math.floor(amount / spendThreshold); // Calculate the number of multiples
        const selectedRewardRate = rewardRate[reward]; // Get the reward rate for the selected reward
        const rewardPoints = multiples * selectedRewardRate; // Calculate the total reward points

        setGeneratedRewards(rewardPoints);
        setLoading(false);
    };

    const recordSpend = e => {
        e.preventDefault();

        // Retrieve existing data from local storage
        const existingData = localStorage.getItem("rewardData");
        let rewardData = [];

        if (existingData) {
            // If data exists, parse it from JSON to an array
            rewardData = JSON.parse(existingData);
        }

        const currentDate = new Date();
        const formattedDate = format(currentDate, "dd-MM-yy hh:mm a");
        const rewardEntry = {
            amount: amount,
            rewardPoints: generatedRewards,
            date: formattedDate,
            rewardRate: reward
        };

        // Append the new object to the existing data or create a new array with it
        rewardData.push(rewardEntry);

        // Store the updated data in local storage
        localStorage.setItem("rewardData", JSON.stringify(rewardData));

        toast.success("Points saved to tracker");
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
            <Header />
            <main className="mt-12 flex w-full flex-1 flex-col items-center px-4 text-center sm:mt-20">
                <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
                    <Balancer>Calculate Your Reward Points</Balancer>
                </h1>
                <p className="mt-4 mb-6 text-center text-sm font-medium text-slate-500">
                    (Currently in Beta for Axis Magnus users)
                </p>
                <div className="w-full max-w-xl">
                    <div className="mt-10 flex items-center space-x-3">
                        <img src="/1-black.png" width={30} height={30} alt="1 icon" />
                        <p className="text-left font-medium">Enter the amount</p>
                    </div>
                    <input
                        name="amount"
                        type="text"
                        value={isNaN(amount) ? "" : amount.toString()} // Check if amount is NaN, set empty string as value
                        onChange={e => setAmount(parseInt(e.target.value, 10) || 0)} // Set amount to 0 if parsed value is NaN
                        className="text-md my-5 block w-full rounded-md border border-gray-300 text-gray-900 placeholder-gray-300 hover:bg-gray-50 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="100000"
                    />
                    <div className="mb-5 flex items-center space-x-3">
                        <img src="/2-black.png" width={30} height={30} alt="1 icon" />
                        <p className="text-left font-medium">Rewards</p>
                    </div>
                    <div className="block">
                        <DropDown reward={reward} setReward={newReward => setReward(newReward)} />
                    </div>

                    {!loading && (
                        <button
                            className="mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
                            onClick={e => checkRewards(e)}
                        >
                            Check your reward
                        </button>
                    )}
                    {loading && (
                        <button
                            className="mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
                            disabled
                        >
                            <LoadingDots color="white" style="large" />
                        </button>
                    )}
                </div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{ duration: 2000 }}
                />
                <hr className="border-1 h-px bg-gray-700 dark:bg-gray-700" />
                <div className="my-10 space-y-10">
                    {generatedRewards && (
                        <>
                            <div>
                                <h2 className="mx-auto text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Total Reward Points
                                </h2>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-8">
                                <p className="text-6xl font-bold">{generatedRewards}</p>
                            </div>
                            <div className="flex flex-col">
                                <button
                                    className="mt-6 w-1/2 m-auto rounded-xl border bg-white px-4 py-3 font-medium text-black hover:bg-gray-100 sm:mt-4"
                                    onClick={e => recordSpend(e)}
                                >
                                    Save Points
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Home;
