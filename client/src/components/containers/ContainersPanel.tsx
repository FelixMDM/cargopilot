"use client";
import { useEffect, useState } from "react";
import Containers from "./Containers";
import Link from "next/link";

interface FormElements extends HTMLFormControlsCollection {
    comments: HTMLInputElement
}

interface CommentFormElement extends HTMLFormElement {
    readonly elements: FormElements
}

type Matrix = string[][]
type Move = [number, number, number, number]

const ContainersPanel = ()  => {

    const [grid, setGrid] = useState<Matrix[]>([Array(8).fill(Array(12).fill("UNUSED"))]);
    const [moves, setMoves] = useState<Move[]>(Array(2).fill(Array(4).fill(0)));
    const [currentIndex, setCurrentIndex] = useState(0);

    const [comments, setComments] = useState<string>("");
    const [manifestDownloaded, setManifestDownloaded] = useState(false);
    
    const [startCell, setStartCell] = useState("None");
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

    const updateGridForMove = (moveIndex: number) => {
        if (!grid.length || !moves.length || moveIndex < 0 || moveIndex >= moves.length) return;

        const [startX, startY] = moves[moveIndex];
        setStartCell(grid[moveIndex][startX][startY]);
    };

    const nextGrid = () => {
        if (currentMoveIndex < moves.length - 1) {
            updateGridForMove(currentMoveIndex + 1);
            setCurrentMoveIndex((prev) => prev + 1);
        }
    
        if (currentIndex < grid.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prevGrid = () => {
        if (currentMoveIndex > 0) {
            updateGridForMove(currentMoveIndex - 1);
            setCurrentMoveIndex((prev) => prev - 1);
        }
    
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = (event: React.FormEvent<CommentFormElement>) => {
        event.preventDefault();
        const commentValue = event.currentTarget.elements.comments.value;
        console.log("Submitted Comment:", commentValue);
        setComments("");
    };

    const handleDownload = () => {
        setManifestDownloaded(true);
    }

    useEffect(() => {
        try {
            fetch("http://localhost:8080/uploadManifest", {
                method: "GET",
            }).then((response) => response.json()).then((data) => {
                setGrid(data[0].steps);
                setMoves(data[1].moves);
                console.log("haiiiiiiiii");
                console.log(data);
                console.log(data[0]);
                console.log(data[1]);
                {
                    if (grid.length > 0 && moves.length > 0) {
                        const [startX, startY] = moves[currentMoveIndex];
                        // console.log("yolo",data[0].steps[currentMoveIndex])
                        setStartCell(data[0].steps[currentMoveIndex][startX][startY+1]);
                    }
                }
            })

        } catch (error) {
            console.error("Full error details:", error);
            alert("There was an error getting manifest.");
        }
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row mt-[5%] justify-evenly">
                <div className="flex flex-col w-[10%] space-y-[15%] items-center">
                    <button 
                        onClick={prevGrid} 
                        disabled={currentIndex === 0}
                        className="w-[100%] h-[10%] mt-[15%] bg-blue-600 rounded-md font-bold text-white">
                        PREV
                    </button>
                    {currentIndex >= 0 && currentIndex < moves.length && 
                        <p className="bg-gray-50 border p-2 border-gray-300 text-gray-900 text-sm rounded-md">
                            Move {startCell} from ({moves[currentMoveIndex][0]}, {moves[currentMoveIndex][1]}) to ({moves[currentMoveIndex][2]}, {moves[currentMoveIndex][3]}).
                        </p>
                    }
                </div> 
                <div className="flex flex-col">
                    {currentIndex === moves.length && 
                        <div className="absolute flex flex-col h-[50%] w-[50%] left-[25%] rounded-md opacity-95 bg-slate-500 text-white font-bold text-center justify-center items-center">
                            <div className="">
                                Balance finished. Please download and email outbound manifest.  
                            </div>
                            <button
                                onClick={handleDownload}
                            >
                                Download Manifest
                            </button>
                            {manifestDownloaded && 
                                <Link
                                    href="/options"
                                >
                                    Back to options
                                </Link>
                            }
                        </div>
                    }
                    <Containers grid={grid[currentIndex]} steps={moves[currentIndex]}/>
                </div>
                <div className="flex flex-col w-[10%] space-y-[15%] items-center">
                    <button 
                        onClick={nextGrid} 
                        disabled={currentIndex === grid.length - 1}
                        className="w-[100%] h-[10%] mt-[15%] bg-blue-600 rounded-md font-bold text-white">
                        NEXT
                    </button>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col">
                            <input
                                id="comments"
                                name="comments"
                                type="text"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Comments"
                                required
                            />
                        </div>
                        <button
                            type="submit"   
                            className="w-full mt-[15%] py-1 bg-blue-600 rounded-md font-bold text-white"
                        >
                            SUBMIT
                        </button>
                    </form>
                </div>
            </div>
            <div className="w-[80%] text-white p-2 font-bold text-2xl bg-blue-950">
                TITANIC
            </div>
            <div className="w-[80%] h-[300px] p-2 text-white font-bold text-2xl bg-red-950">
                TITANIC 
            </div>
        </div>
    );
}

export default ContainersPanel;