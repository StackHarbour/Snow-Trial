import {NextResponse} from 'next/server';export async function GET(){return NextResponse.json({status:'unavailable',layers:[],message:'Production map provider is not configured.'})}
