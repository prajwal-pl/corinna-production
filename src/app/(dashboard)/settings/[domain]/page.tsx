import { onGetCurrentDomainInfo } from "@/actions/settings";
import BotTrainingForm from "@/components/forms/settings/bot-training";
// import BotTrainingForm from '@/components/forms/settings/bot-training'
import SettingsForm from "@/components/forms/settings/form";
import InfoBar from "@/components/infobar";
// import ProductTable from '@/components/products'
import { redirect } from "next/navigation";
import React from "react";

type Props = { params: Promise<{ domain: string }> };

const DomainSettingsPage = async ({ params }: Props) => {
  const { domain } = await params;
  const domainInfo = await onGetCurrentDomainInfo(domain);
  if (!domainInfo) redirect("/dashboard");

  return (
    <>
      <InfoBar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0 pl-2 pr-4 ">
        <SettingsForm
          plan={domainInfo.subscription?.plan!}
          chatBot={domainInfo.domains[0].chatBot}
          id={domainInfo.domains[0].id}
          name={domainInfo.domains[0].name}
        />
        <BotTrainingForm id={domainInfo.domains[0].id} />
        {/* <ProductTable
          id={domain.domains[0].id}
          products={domain.domains[0].products || []}
        /> */}
      </div>
    </>
  );
};

export default DomainSettingsPage;
