"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const RegistrationDialogs = ({
                                 showSuccessDialog,
                                 showErrorDialog,
                                 errorMessage,
                                 onSuccessClose,
                                 onErrorClose
                             }) => {
    return (
        <>
            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={onSuccessClose}>
                <DialogContent className="sm:max-w-md rounded-lg">
                    <DialogHeader className="pb-2">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl font-semibold text-green-700">
                            ลงทะเบียนสำเร็จ!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">
                            ขอบคุณสำหรับการลงทะเบียน กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...
                        </p>
                        <div className="w-12 h-1 mx-auto rounded-full animate-pulse"></div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={onSuccessClose}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            ตกลง
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={showErrorDialog} onOpenChange={onErrorClose}>
                <DialogContent className="sm:max-w-md rounded-lg border-red-100">
                    <DialogHeader className="pb-2">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-xl font-semibold text-red-700">
                            เกิดข้อผิดพลาด
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-4">
                        <p className="text-gray-600 mb-2 px-4">
                            {errorMessage}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={onErrorClose}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            ลองอีกครั้ง
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RegistrationDialogs;