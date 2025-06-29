import ChartDonatGue from "@/components/chart-donat-gue"
import ChartGue from "@/components/chart-gue"
import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import axios from "axios"
import { CalendarDays, ChartColumn, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import DetailDialog from "../dashboard/DetailDialog"


export function Page() {
    const [chartData, setChartData] = useState([
        { time: "January", ng: 0, retry: 0 },
    ])
    const [lineData, setLineData] = useState({ lineName: '', lastStatus: '', isDataExist: '' })
    const totalNg = chartData.reduce((total, item) => Number(total) + Number(item.ng), 0)
    const totalRetry = chartData.reduce((total, item) => Number(total) + Number(item.retry), 0)
    const today = new Date();
    const year = today.getFullYear();
    const month = today.toLocaleString('en-US', { month: 'short' }); // 'Jan', 'Feb', etc.
    const day = String(today.getDate()).padStart(2, '0'); // tambahkan 0 di depan jika perlu
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    const [badgeContent, setBadgeContent] = useState('')
    const [badgeBG, setBadgeBG] = useState('')
    const [badgeColor, setBadgeColor] = useState('')
    const [rowDataSelected, setRowDataSelected] = useState({ status: '' })
    const [showFindModal, setShowFindModal] = useState(false)

    useEffect(() => {

        const fetchData = () => {
            axios
                .get(import.meta.env.VITE_APP_ENDPOINT + '/report/chart1', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    const data = response.data.data
                    setChartData(data)
                    setLineData({
                        lineName: response.data.line_name,
                        lastStatus: response.data.last_status,
                        isDataExist: response.data.is_data_exist
                    })
                    switch (response.data.last_status) {
                        case 'Red':
                            setBadgeContent('Not Good');
                            setBadgeBG('red');
                            setBadgeColor('white'); break;
                        case 'Yellow':
                            setBadgeContent('Retry');
                            setBadgeBG('yellow');
                            setBadgeColor('black'); break;
                        case 'Green':
                            setBadgeContent('Good');
                            setBadgeBG('green');
                            setBadgeColor('white'); break;
                        case 'Off':
                            setBadgeContent('Offline');
                            setBadgeBG('gray');
                            setBadgeColor('white'); break;
                    }
                }).catch(error => {
                    console.log(error)
                })
        }
        fetchData()

        const interval = setInterval(fetchData, 60000); // ⏱️ refresh tiap 60 detik

        return () => clearInterval(interval); // 🧹 bersihkan saat komponen unmount
    }, [])

    return (
        <>
            {/* Layout utama: full height layar, tanpa scroll luar */}
            <div className="bg-gray-100 h-screen flex flex-col overflow-hidden">

                {/* Header tetap tinggi 64px */}
                <header className="flex h-13 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="md:block">
                                <BreadcrumbLink href="#">Welcome</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {/* Kontainer isi utama (card + chart): fleksibel & scrollable */}
                <div className="container mx-auto p-2 flex-grow flex flex-col overflow-auto min-h-0">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-1 flex-shrink-0 text-neutral-400">
                        <div className="rounded-lg p-1 flex items-center space-x-4"><Settings /> Line : <Badge variant={'default'}>{lineData.lineName}</Badge></div>
                        <div className="rounded-lg p-1 flex items-center space-x-4"><CalendarDays /> Time : <Badge variant={'default'}>{formattedDate}</Badge></div>
                        <div className="rounded-lg p-1 flex items-center space-x-4"><ChartColumn /> Status : <Badge style={{ background: badgeBG, color: badgeColor }}>
                            {
                                badgeContent

                            }</Badge></div>
                    </div>

                    {/* Cards section: tinggi fleksibel sesuai isi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3 flex-shrink-0">
                        {/* Not Good Card */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                            <div className="text-red-500 text-3xl">❌</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Not Good (NG)</h3>
                                <p className="text-3xl font-bold text-gray-900">{totalNg}</p>
                                <a href="#" className="text-blue-500 text-sm" onClick={() => {
                                    setRowDataSelected({ status: 'Red' })
                                    setShowFindModal(true)
                                }}>Details</a>
                            </div>
                        </div>

                        {/* Retry Card */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                            <div className="text-yellow-500 text-3xl">⚠️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Retry</h3>
                                <p className="text-3xl font-bold text-gray-900">{totalRetry}</p>
                                <a href="#" className="text-blue-500 text-sm" onClick={() => {
                                    setRowDataSelected({ status: 'Yellow' })
                                    setShowFindModal(true)
                                }}>Details</a>
                            </div>
                        </div>


                    </div>

                    {/* Charts section: ambil sisa ruang + tidak overflow */}
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-5 min-h-0">

                        {/* Donut Chart (kosong dulu) */}
                        <div className=" md:col-span-1 flex flex-col min-h-[300px]">
                            <ChartDonatGue theData={chartData} lineData={lineData} />
                        </div>

                        {/* Bar Chart */}
                        <div className=" md:col-span-2 flex flex-col min-h-0">
                            <ChartGue theData={chartData} lineData={lineData} />
                        </div>
                    </div>
                </div>
            </div>
            <DetailDialog open={showFindModal} selectedRowData={rowDataSelected} onClose={() => { setShowFindModal(false); }} />
        </>
    )
}

