import React, { useCallback, useEffect, useState } from "react";
import "../../../styles/dropdown.css";
import Button from "../basic/Button";
import DropwDown from "../basic/Dropdown";
import Headline from "../basic/Headline";
import CardWrapper from "../wrapper/CardWrapper";
import { LoggerService } from "@/frontend/services/LoggerService";
import { Deployment, Logger } from "@/backend/entities";
import { DeploymentService } from "@/frontend/services/DeploymentService";
import { MeasurementAnchors } from "@/frontend/enum";
import { useStore } from "@/frontend/store";
import EmptyDropdown from "../basic/EmptyDropdown";
import { observer } from "mobx-react-lite";

/**
 * DeploymentSelection component.
 *
 * @param {function} setAppliedData - Function to set the applied deployment and logger data.
 */
interface DeploymentSelectionProps {
  setAppliedData: (deployment: number, logger: number) => void;
}

const DeploymentSelection: React.FC<DeploymentSelectionProps> = ({ setAppliedData }) => {
  const { data: dataStore } = useStore();
  const loggerService: LoggerService = new LoggerService(dataStore);
  const deploymentService: DeploymentService = new DeploymentService(dataStore);
  const [loggers, setLoggers] = useState<Logger[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedLogger, setSelectedLogger] = useState<number>(-1);
  const [selectedDeployment, setSelectedDeployment] = useState<number>(-1);

  /**
   * Set initial selected logger and deployment if available in the store.
   */
  useEffect(() => {
    if (dataStore.selectedColumn.deployment_id > -1 && dataStore.selectedColumn.logger_id > -1) {
      setAppliedData(dataStore.selectedColumn.deployment_id, dataStore.selectedColumn.logger_id);
      setSelectedLogger(dataStore.selectedColumn.logger_id);
    }
  }, []);

  /**
   * Handles the apply button click to set the selected deployment and logger.
   */
  const onApplyClick = () => {
    setAppliedData(selectedDeployment, selectedLogger);
  };

  /**
   * Resets the deployment state.
   */
  const resetDeployments = () => {
    setDeployments([]);
    setSelectedDeployment(-1);
  };

  /**
   * Handles the selection of a logger.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the dropdown.
   */
  const selectLogger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeployment(-1);
    const selected = Number(e.target.value);
    setSelectedLogger(selected > -1 ? loggers[selected].logger_id : -1);
  };

  /**
   * Handles the selection of a deployment.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the dropdown.
   */
  const selectDeployment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedDeployment(selected > -1 ? deployments[selected].deployment_id : -1);
  };

  /**
   * Fetches loggers with deployments from the service.
   */
  const getLoggersWithDeployments = useCallback(async () => {
    const data = await loggerService.getLoggersWithDeployments();
    setLoggers(data);
  }, []);

  /**
   * Fetches deployments for the selected logger.
   */
  const getDeploymentsByLogger = useCallback(async () => {
    resetDeployments();
    if (selectedLogger === -1) {
      return;
    }
    setSelectedDeployment(-1);
    const data = await deploymentService.getDeploymentsByLogger(selectedLogger);
    setDeployments(data);
  }, [selectedLogger]);

  /**
   * Effect to fetch loggers with deployments on component mount.
   */
  useEffect(() => {
    getLoggersWithDeployments();
  }, [getLoggersWithDeployments]);

  /**
   * Effect to fetch deployments when a logger is selected.
   */
  useEffect(() => {
    getDeploymentsByLogger();
  }, [getDeploymentsByLogger]);

  /**
   * Effect to set the selected deployment from the store when deployments are fetched.
   */
  useEffect(() => {
    if (dataStore.selectedColumn.deployment_id > -1 && deployments.length > 0) {
      setSelectedDeployment(dataStore.selectedColumn.deployment_id);
      dataStore.setSelectedColumn(-1, -1);
    }
  }, [deployments]);

  return (
    <div className="basis-full md:basis-1/3">
      <CardWrapper
        text={"Selection of single deployment"}
        hasMap={false}
        id={MeasurementAnchors.SelectionSingleDeployment}
      >
        <Headline text={"Choose logger ID"} />
        {loggers.length > 0 && (
          <DropwDown
            options={loggers}
            option_keys={["logger_id"]}
            setSelection={selectLogger}
            defaultValue={selectedLogger}
            emptyDefaultRow={true}
          />
        )}
        {(loggers.length === 0 || !loggers) && <EmptyDropdown />}
        <Headline text={"Choose deployment"} />
        {deployments?.length > 0 && (
          <DropwDown
            key={selectedDeployment}
            emptyDefaultRow={true}
            options={deployments}
            option_keys={["deployment_id"]}
            disabled={selectedLogger === -1}
            setSelection={selectDeployment}
            defaultValue={selectedDeployment}
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

export default observer(DeploymentSelection);
