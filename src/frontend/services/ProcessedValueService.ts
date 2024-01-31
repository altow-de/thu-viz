import { ProcessedValue } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DataStore } from "../store/dataStore";
import { DatabaseError } from "@/backend/services/DatabaseError";
import { ProcessedValuesForDiagrams } from "@/backend/services/ProcessedValueService";

export class ProcessedValueService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/processedvalue/", dataStore);
  }

  getAllData(): Promise<ProcessedValue[]> {
    return this.fetchData("getAllData");
  }

  getProcessedValuesByDeploymentAndLogger(
    deployment_id: number,
    logger_id: number
  ): Promise<ProcessedValuesForDiagrams[] | DatabaseError> {
    return this.fetchData(
      `getProcessedValuesByDeploymentAndLogger?deployment_id=${deployment_id}&logger_id=${logger_id}`
    );
  }
}
