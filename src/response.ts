export interface Response {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: string;
  vulnerabilities: Vulnerability[];
}

interface Vulnerability {
  cve: CVE;
}

interface CVE {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Description[];
  metrics: Metric[];
}

interface Description {
  lang: string;
  value: string;
}

interface Metric {
  cvssMetricV30: CVSSMetric[];
}

interface CVSSMetric {
  source: string;
  type: string;
  cvssData: CVSSData;
  exploitabilityScore: number;
  impactScore: number;
}

interface CVSSData {
  version: string;
  vectorString: string;
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: string;
}
