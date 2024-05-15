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
import { useStore } from "@/frontend/store";
import EmptyDropdown from "../basic/EmptyDropdown";

interface DeploymentSelectionProps {
  setAppliedData: (deployment: number, logger: number) => void;
  logger?: number;
  deployment?: number;
}

const DeploymentSelection: React.FC<DeploymentSelectionProps> = ({ setAppliedData, logger, deployment }) => {
  const { data: dataStore } = useStore();
  const loggerService: LoggerService = new LoggerService(dataStore);
  const deploymentService: DeploymentService = new DeploymentService(dataStore);
  const [loggers, setLoggers] = useState<Logger[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedLogger, setSelectedLogger] = useState<number>(dataStore.selectedColumn.logger_id || -1);
  const [selectedDeployment, setSelectedDeployment] = useState<number>(
    dataStore.selectedColumn.logger_id && dataStore.selectedColumn.logger_id > -1 ? deployment || -1 : -1
  );
  useEffect(() => {
    if (selectedLogger > -1 && selectedDeployment > -1) {
      setAppliedData(selectedDeployment, selectedLogger);
    }
  }, []);

  const onApplyClick = () => {
    setAppliedData(selectedDeployment, selectedLogger);
  };

  const resetDeployments = () => {
    setDeployments([]);
    setSelectedDeployment(-1);
  };

  const selectLogger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeployment(-1);
    const selected = Number(e.target.value);
    setSelectedLogger(selected > -1 ? loggers[selected].logger_id : -1);
  };

  const selectDeployment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedDeployment(selected > -1 ? deployments[selected].deployment_id : -1);
  };

  const getLoggersWithDeployments = useCallback(async () => {
    const data = await loggerService.getLoggersWithDeployments();
    setLoggers(data);
  }, []);

  useEffect(() => {
    getLoggersWithDeployments();
  }, [getLoggersWithDeployments]);

  const getDeploymentsByLogger = useCallback(async () => {
    resetDeployments();
    if (selectedLogger === -1) {
      return;
    }
    setSelectedDeployment(-1);
    const data = await deploymentService.getDeploymentsByLogger(selectedLogger);
    setDeployments(data);
    dataStore.setSelectedColumn(-1, -1);
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
        {loggers.length > 0 && (
          <DropwDown
            options={loggers}
            option_keys={["logger_id"]}
            setSelection={selectLogger}
            defaultValue={logger}
            emptyDefaultRow={true}
          />
        )}
        {(loggers.length === 0 || !loggers) && <EmptyDropdown />}
        <Headline text={"Choose deployment"} />
        {deployments?.length > 0 && (
          <DropwDown
            emptyDefaultRow={true}
            options={deployments}
            option_keys={["deployment_id"]}
            disabled={selectedLogger === -1}
            setSelection={selectDeployment}
            defaultValue={deployment}
          />
        )}
        {(deployments.length === 0 || !deployments) && <EmptyDropdown />}
        <div className="flex justify-center gap-2">
          <Button text="Apply" onClick={onApplyClick} disabled={selectedLogger === -1 || selectedDeployment === -1} />
        </div>
      </CardWrapper>
    </div>
  );
};

export default DeploymentSelection;
