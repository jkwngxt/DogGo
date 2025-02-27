"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons';

const FogInputRow = ({ id, name, breed, onChange, deleteRow, showDelete, showErrors }) => {
    return (
        <div className="flex flex-row mx-10 gap-10 justify-center">
            <div className="flex flex-col w-full">
                <Label htmlFor={`dogname-${id}`}>ชื่อสุนัข</Label>
                <Input
                    id={`dogname-${id}`}
                    type="text"
                    placeholder="ชื่อสุนัข"
                    className={`rounded-xl mt-1 ${showErrors && !name ? 'border-red-500' : ''}`}
                    value={name || ''}
                    onChange={(e) => onChange(id, "name", e.target.value)}
                />
                {showErrors && !name && (
                    <p className="text-red-500 text-sm mt-1 error-message">กรุณากรอกชื่อสุนัข</p>
                )}
            </div>
            <div className="flex flex-col w-full">
                <Label htmlFor={`breed-${id}`}>สายพันธุ์</Label>
                <Input
                    id={`breed-${id}`}
                    type="text"
                    placeholder="สายพันธุ์"
                    className={`rounded-xl mt-1 ${showErrors && !breed ? 'border-red-500' : ''}`}
                    value={breed || ''}
                    onChange={(e) => onChange(id, "breed", e.target.value)}
                />
                {showErrors && !breed && (
                    <p className="text-red-500 text-sm mt-1 error-message">กรุณากรอกสายพันธุ์สุนัข</p>
                )}
            </div>
            <div className="mt-6">
                {showDelete && (
                    <FontAwesomeIcon
                        icon={faCircleMinus}
                        onClick={() => deleteRow(id)}
                        className="h-6 w-6 text-red-500 cursor-pointer"
                    />
                )}
            </div>
        </div>
    );
};

export default FogInputRow;