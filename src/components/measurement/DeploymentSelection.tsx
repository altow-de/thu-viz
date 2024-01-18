import React, { useCallback, useEffect, useState } from "react";
import "../../../styles/dropdown.css";
import Button from "../basic/Button";
import DropwDown from "../basic/Dropdown";
import Headline from "../basic/Headline";
import CardWrapper from "../wrapper/CardWrapper";
import { LoggerService } from "@/frontend/services/LoggerService";
import { Deployment, Logger } from "@/backend/entities";
import { DeploymentService } from "@/frontend/services/DeploymentService";
import { MeasurementAnkers } from "@/frontend/enum";

interface DeploymentSelectionProps {}

const DeploymentSelection: React.FC<DeploymentSelectionProps> = () => {
  const loggerService: LoggerService = new LoggerService();
  const deploymentService: DeploymentService = new DeploymentService();
  const [loggers, setLoggers] = useState<Logger[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedLogger, setSelectedLogger] = useState<number>(-1);
  const [selectedDeployment, setSelectedDeployment] = useState<number>(-1);

  const selectLogger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedLogger(selected);
  };

  const selectDeployment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedDeployment(selected);
  };

  const getLoggersWithDeployments = useCallback(async () => {
    const data = await loggerService.getLoggersWithDeployments();
    setLoggers(data);
  }, []);

  useEffect(() => {
    getLoggersWithDeployments();
  }, [getLoggersWithDeployments]);

  const getDeploymentsByLogger = useCallback(async () => {
    if (selectedLogger === -1) return;
    const data = await deploymentService.getDeploymentsByLogger(selectedLogger);
    setDeployments(data);
  }, [selectedLogger]);

  useEffect(() => {
    getDeploymentsByLogger();
  }, [getDeploymentsByLogger]);

  return (
    <div className="basis-full md:basis-1/3">
      <CardWrapper
        text={"Selection of single deployment"}
        hasMap={false}
        id={MeasurementAnkers.SelectionSingleDeployment}
      >
        <Headline text={"Choose logger ID"} />
        <DropwDown options={loggers} option_keys={["logger_id", "Comment"]} setSelection={selectLogger} />

        <Headline text={"Choose deployment"} />
        <DropwDown
          options={deployments}
          option_keys={["deployment_id"]}
          disabled={selectedLogger === -1}
          setSelection={selectDeployment}
        />
        <div className="flex justify-center">
          <Button text="Apply" onClick={() => {}} disabled={!(selectedLogger > -1 && selectedDeployment > -1)} />
        </div>
      </CardWrapper>
    </div>
  );
};

export default DeploymentSelection;
