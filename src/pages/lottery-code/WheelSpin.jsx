import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import rewardService from "@/services/rewardService";
import lotteryCodeService from "@/services/lotteryCodeService";

export default function WheelSpin() {
    const [rewards, setRewards] = useState([]);
    const [lotteryCodes, setLotteryCodes] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rewardRes, codeRes] = await Promise.all([
                    rewardService.getAll(),
                    lotteryCodeService.getAll(),
                ]);
                setRewards(rewardRes);
                setLotteryCodes(codeRes.filter(code => code.user != null));
            } catch (error) {
                toast.error("Failed to load data");
            }
        };
        fetchData();
    }, []);

    const handleSpin = async () => {
        if (!selectedReward || !selectedReward.rewardId) return toast.error("Please select a reward first");
        if (lotteryCodes.length === 0) return toast.error("No available lottery codes");

        setIsSpinning(true);
        setTimeout(async () => {
            try {
                const unassignedCodes = lotteryCodes.filter(code => code && !code.reward && code.lotteryCodeId);
                if (unassignedCodes.length === 0) {
                    setIsSpinning(false);
                    return toast.error("All codes already have rewards or missing ID");
                }

                const codeToUpdate = unassignedCodes[Math.floor(Math.random() * unassignedCodes.length)];

                await lotteryCodeService.updateReward(codeToUpdate.lotteryCodeId, selectedReward.rewardId);

                setLotteryCodes((prev) =>
                    prev.map((c) =>
                        c.lotteryCodeId === codeToUpdate.lotteryCodeId ? { ...c, reward: selectedReward } : c
                    )
                );

                toast.success(`Reward assigned: ${selectedReward.name} to ${codeToUpdate.code}`);
            } catch (error) {
                toast.error("Failed to update lottery code");
            } finally {
                setIsSpinning(false);
            }
        }, 2000);
    };

    return (
        <div className="max-w-2xl space-y-5 mt-5">
            <div className="space-y-3">
                <Select
                    value={selectedReward?.rewardId?.toString() || ""}
                    onValueChange={(val) => {
                        const reward = rewards.find(r => r.rewardId.toString() === val);
                        setSelectedReward(reward);
                    }}
                >
                    <SelectTrigger className="w-full">{selectedReward?.name || "Select a reward"}</SelectTrigger>
                    <SelectContent>
                        {rewards.map((reward) => (
                            <SelectItem key={reward.rewardId} value={reward.rewardId.toString()}>{reward.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button className="w-full" disabled={isSpinning} onClick={handleSpin}>
                    {isSpinning ? "Spinning..." : "Spin"}
                </Button>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Lottery Codes</h2>
                {lotteryCodes.map((item, index) => (
                    <Card key={index} className="p-4 flex justify-between items-center">
                        <div>
                            <div className="font-bold">{item.code}</div>
                            <div className="text-muted-foreground text-sm">
                                Reward: {item.reward?.name || "-- Not assigned --"}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}