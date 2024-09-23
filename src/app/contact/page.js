"use client"
import { useState, useEffect } from 'react'

const ItemCard = ({label, value})=>{
    return (
        <div className='flex gap-4 bg-white  rounded-md m-2 p-2'>
            <div>{ label }</div>
            <div>{ value }</div>
        </div>
    )
    
}

export default function Contact(){
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)

    async function onLoadData() {
        setLoading(true)
        let res = await fetch('/api/contact')
        let data = await res.json()
        setData(data)
        setLoading(false)
    }

    useEffect(() => {
        onLoadData()
    }, [])

    return (
        <> 
            <h2 className="text-center text-3xl w-full">Get In Touch</h2>
            
            <p className="text-center margin-0 mx-auto w-2/3	">
                lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem 
                ipsum lorem ipsum lorem ipsum 
            </p>

            <div className="flex mt-16">
                <div className="md:w-3/4 px-4 ">
                    <div className=" bg-white p-10  rounded-xl">
                        <h3 className="text-2xl py-2">Leave a message</h3>
                        <div className="flex gap-6">
                            <div>
                                <label>Name</label>
                                <input type="text" className="border my-input-text"/>
                            </div>
                            <div className="w-full">
                                <label>Email</label>
                                <input type="text" className="border my-input-text w-full"/>
                            </div>
                        </div>
                        <div className="w-full my-2">
                            <label>Subject</label>
                            <input type="text" className="my-input-text w-full"/>
                        </div>
                        <div className="w-full">
                            <label>Message</label>
                            <textarea className="border my-input-text w-full"></textarea>
                        </div>
                        <div className="w-full py-2">
                            <button className="mx-1 h-9 items-center justify-center px-4  rounded-md bg-amber-500">
                                <label>Send Message</label>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/3">

                {
                    !isLoading && Object.keys(data.location).map(key => {
                       return <ItemCard label={key} value={data.location[key]} key={key}/>
                    })
                }

                {
                    !isLoading && Object.keys(data.phone).map(key => {
                       return <ItemCard label={key} value={data.phone[key]} key={key}/>
                    })
                }

                {
                    !isLoading && Object.keys(data.social).map(key => {
                       return <ItemCard label={key} value={data.social[key]} key={key}/>
                    })
                }
                
                   
                </div>
            </div>

        </>
    );
}