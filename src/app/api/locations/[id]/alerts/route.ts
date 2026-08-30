import {NextResponse} from 'next/server';export async function GET(){return NextResponse.json({status:'unavailable',alerts:[],message:'Alert provider is not configured.'})}
