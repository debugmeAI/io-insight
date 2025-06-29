import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

import { useState } from "react";
import { toast } from "sonner";

interface FindModalProps {
    open: boolean
    onClose: () => void
}

export default function DeviceAddDialog({ open, onClose }: FindModalProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        IP_device_tx: "",
        IP_device_rx: "",
        model: "",
        line_name: "",
    })

    const handleSave = () => {
        const datanya = {
            IP_device_tx: formData.IP_device_tx,
            IP_device_rx: formData.IP_device_rx,
            model: formData.model,
            line_name: formData.line_name,
        }

        if (!confirm('Are you sure want to save ?')) {
            return
        }

        setIsSaving(true)
        axios
            .post(import.meta.env.VITE_APP_ENDPOINT + '/device-master', datanya, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('isLoggedIn')
                },
            })
            .then((response) => {
                setIsSaving(false)
                setFormData({
                    IP_device_tx: "",
                    IP_device_rx: "",
                    model: "",
                    line_name: "",
                })
                toast.success('Server Response', { description: response.data.message })
            }).catch(error => {
                setIsSaving(false)

                const respon = Object.keys(error.response.data)
                let msg = ''
                for (const item of respon) {
                    msg += `${error.response.data[item]}`
                }
                toast.error('Server Response', { description: msg })
            })
    }

    function handleChangeForm(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Register New Device</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-2">
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Tx IP</Label>
                            <Input id="name-1" name="IP_device_tx" onChange={handleChangeForm} value={formData.IP_device_tx} placeholder="ex : 192.168.0.0"/>
                        </div>
                    </div>
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-2">Rx IP</Label>
                            <Input id="name-2" name="IP_device_rx" onChange={handleChangeForm} value={formData.IP_device_rx} placeholder="ex : 192.168.0.0"/>                           
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-2">
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-3">Model</Label>
                            <Input id="name-3" name="model" onChange={handleChangeForm} value={formData.model} />
                        </div>
                    </div>
                    <div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-4">Line</Label>
                            <Input id="name-4" name="line_name" onChange={handleChangeForm} value={formData.line_name} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={isSaving}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}