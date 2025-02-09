import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Plus, Filter } from "lucide-react";

const GadgetControls = ({ onAddGadget, onFilterChange, newGadgetName, setNewGadgetName }) => {
    const statuses = ["All", "Available", "Deployed", "Destroyed", "Decommissioned"];

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex gap-4">
                        <Input
                            type="text"
                            placeholder="New Gadget Name"
                            value={newGadgetName}
                            onChange={(e) => setNewGadgetName(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={onAddGadget} className="bg-green-500 hover:bg-green-600 whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Gadget
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 min-w-[200px]">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <Select onValueChange={onFilterChange} defaultValue="All">
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default GadgetControls;