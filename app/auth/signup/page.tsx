import * as React from 'react';
import SignUpConsultant from '@/components/SignUpConsultant';
import SignUpClient from '@/components/SignUpClient';
import { IPageProps } from '@/types/page';
import { isClient, isConsultant } from '@/utils/common';

export default async function SignUpPage(props: IPageProps) {
    const searchParams = await props.searchParams;
    const type = searchParams?.['type'];

    if (isClient(type)) return <SignUpClient />;
    if (isConsultant(type)) return <SignUpConsultant />;
    return <div>Invalid signup type</div>;
};
