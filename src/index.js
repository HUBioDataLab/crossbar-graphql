import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

import dotenv from "dotenv";
dotenv.config();

const typeDefs = `#graphql

#######################################
#
# REACTION -> EC-NUMBER
# GO-TERM -> BIOLOGICAL PROCESS - MOLECULAR FUNCTION - CELLULAR COMPONENT
#
#######################################

type BiologicalProcess @node {
  id: ID
  name: String
  anc2vec_embedding: [Float]
  biologicalProcessIsABiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "Biological_process_is_a_biological_process"
      direction: OUT
    )
  biologicalProcessNegativelyRegulatesBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "Biological_process_negatively_regulates_biological_process"
      direction: OUT
    )
  biologicalProcessNegativelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Biological_process_negatively_regulates_molecular_function"
      direction: OUT
    )
  biologicalProcessPartOfBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "Biological_process_part_of_biological_process"
      direction: OUT
      )
  biologicalProcessPositivelyRegulatesBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "Biological_process_positively_regulates_biological_process"
      direction: OUT
    )
  biologicalProcessPositivelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Biological_process_positively_regulates_molecular_function"
      direction: OUT
    )
  proteinDomainInvolvedInBiologicalProcessReverse: [ProteinDomain!]!
    @relationship(
      type: "Protein_domain_involved_in_biological_process"
      direction: IN
    )
  proteinInvolvedInBiologicalProcessReverse: [Protein!]!
    @relationship(
      type: "Protein_involved_in_biological_process"
      direction: IN
      properties: "Protein_involved_in_biological_process"
    )
}

type CellularComponent @node {
  id: ID
  name: String
  anc2vec_embedding: [Float]
  cellularComponentIsACellularComponent: [CellularComponent!]!
    @relationship(
      type: "Cellular_component_is_a_cellular_component"
      direction: OUT
    )
  cellularComponentPartOfCellularComponent: [CellularComponent!]!
    @relationship(
      type: "Cellular_component_part_of_cellular_component"
      direction: OUT
    )
  proteinDomainLocatedInCellularComponentReverse: [ProteinDomain!]!
    @relationship(
      type: "Protein_domain_located_in_cellular_component"
      direction: IN
    )
  proteinIsActiveInCellularComponentReverse: [Protein!]!
    @relationship(
      type: "Protein_is_active_in_cellular_component"
      direction: IN
      properties: "Protein_is_active_in_cellular_component"
    )
  proteinLocatedInCellularComponentReverse: [Protein!]!
    @relationship(
      type: "Protein_located_in_cellular_component"
      direction: IN
      properties: "Protein_located_in_cellular_component"
    )
  proteinPartOfCellularComponentReverse: [Protein!]!
    @relationship(
      type: "Protein_part_of_cellular_component"
      direction: IN
      properties: "Protein_part_of_cellular_component"
    )
}

type Compound @node {
  id: ID
  alogp: Float
  full_mwt: Float
  heavy_atoms: Int
  inchi: String
  inchikey: String
  qed_score: Float
  selformer_embedding: [Float]
  smiles: String
  species: String
  type: String
  compoundTargetsProtein: [Protein!]!
    @relationship(
      type: "Compound_targets_protein"
      direction: OUT
      properties: "Compound_targets_protein"
    )
}

type Disease @node {
  id: ID
  name: String
  doc2vec_embedding: [Float]
  doid: String
  efo: String
  hp: String
  icd10cm: String
  icd9: String
  meddra: String
  mesh: String
  ncit: String
  omim: String
  orphanet: String
  synonyms: [String]
  umls: String
  diseaseIsADisease: [Disease!]!
    @relationship(
      type: "Disease_is_a_disease"
      direction: OUT
    )
  diseaseIsAssociatedWithDisease: [Disease!]!
    @relationship(
      type: "Disease_is_associated_with_disease"
      direction: OUT
      properties: "Disease_is_associated_with_disease"
    )
  diseaseIsComorbidWithDisease: [Disease!]!
    @relationship(
      type: "Disease_is_comorbid_with_disease"
      direction: OUT
    )
  diseaseIsTreatedByDrug: [Drug!]!
    @relationship(
      type: "Disease_is_treated_by_drug"
      direction: OUT
      properties: "Disease_is_treated_by_drug"
    )
  diseaseModulatesPathway: [Pathway!]!
    @relationship(
      type: "Disease_modulates_pathway"
      direction: OUT
      properties: "Disease_modulates_pathway"
    )
  geneIsRelatedToDiseaseReverse: [Gene!]!
    @relationship(
      type: "Gene_is_related_to_disease"
      direction: IN
      properties: "Gene_is_related_to_disease"
    )
  organismCausesDiseaseReverse: [OrganismTaxon!]!
    @relationship(
      type: "Organism_causes_disease",
      direction: IN,
    )
  phenotypeIsAssociatedWithDiseaseReverse: [Phenotype!]!
    @relationship(
      type: "Phenotype_is_associated_with_disease"
      direction: IN
      properties: "Phenotype_is_associated_with_disease"
    )
}

type Drug @node {
  id: ID
  name: String
  atc_codes: [String]
  bindingdb: String
  cas_number: String
  chebi: String
  chembl: String
  clinicaltrials: String
  drugbank_id: String
  drugcentral: String
  general_references: [String]
  groups: [String]
  inchi: String
  inchikey: String
  kegg_drug: String
  pdb: String
  pharmgkb: String
  pubchem: String
  rxcui: String
  selformer_embedding: [Float]
  smiles: String
  zinc: String
  diseaseIsTreatedByDrugReverse: [Disease!]!
    @relationship(
      type: "Disease_is_treated_by_drug"
      direction: IN
      properties: "Disease_is_treated_by_drug"
    )
  drugDownregulatesGene: [Gene!]!
    @relationship(
      type: "Drug_downregulates_gene"
      direction: OUT
      properties: "Drug_downregulates_gene"
    )
  drugHasSideEffect: [SideEffect!]!
    @relationship(
      type: "Drug_has_side_effect"
      direction: OUT
      properties: "Drug_has_side_effect"
    )
  drugHasTargetInPathway: [Pathway!]!
    @relationship(
      type: "Drug_has_target_in_pathway"
      direction: OUT
      properties: "Drug_has_target_in_pathway"
    )
  drugUpregulatesGene: [Gene!]!
    @relationship(
      type: "Drug_upregulates_gene"
      direction: OUT
      properties: "Drug_upregulates_gene"
    )
  drugInteractsWithDrug: [Drug!]!
    @relationship(
      type: "Drug_interacts_with_drug"
      direction: OUT
      properties: "Drug_interacts_with_drug"
    )
  drugTargetsProtein: [Protein!]!
    @relationship(
      type: "Drug_targets_protein"
      direction: OUT
      properties: "Drug_targets_protein"
    )
}

type EcNumber @node {
  id: ID
  name: String
  rxnfp_embedding: [Float]
  ecNumberIsAEcNumber: [EcNumber!]!
    @relationship(
      type: "Ec_number_is_a_ec_number"
      direction: OUT
    )
  proteinCatalyzesEcNumberReverse: [Protein!]!
    @relationship(
      type: "Protein_catalyzes_ec_number"
      direction: IN
    )
}

type Gene @node {
  id: ID
  ensembl_gene_ids: [String]
  ensembl_transcript_ids: [String]
  gene_names: [String]
  gene_symbol: String
  kegg_ids: [String]
  nt_embedding: [Float]
  drugDownregulatesGeneReverse: [Drug!]!
    @relationship(
      type: "Drug_downregulates_gene"
      direction: IN
      properties: "Drug_downregulates_gene"
    )
  drugUpregulatesGeneReverse: [Drug!]!
    @relationship(
      type: "Drug_upregulates_gene"
      direction: IN
      properties: "Drug_upregulates_gene"
    )
  geneEncodesProtein: [Protein!]!
    @relationship(
      type: "Gene_encodes_protein"
      direction: OUT
    )
  geneIsOrthologousWithGene: [Gene!]!
    @relationship(
      type: "Gene_is_orthologous_with_gene"
      direction: OUT
      properties: "Gene_is_orthologous_with_gene"
    )
  geneIsRelatedToDisease: [Disease!]!
    @relationship(
      type: "Gene_is_related_to_disease"
      direction: OUT
      properties: "Gene_is_related_to_disease"
    )
  geneRegulatesGene: [Gene!]!
    @relationship(
      type: "Gene_regulates_gene"
      direction: OUT
      properties: "Gene_regulates_gene"
    )
}

type GOTerm @node {
  id: ID
  name: String
  anc2vec_embedding: [Float]
}

type MolecularFunction @node {
  id: ID
  name: String
  anc2vec_embedding: [Float]
  biologicalProcessNegativelyRegulatesMolecularFunctionReverse: [BiologicalProcess!]!
    @relationship(
      type: "Biological_process_negatively_regulates_molecular_function"
      direction: IN
    )
  biologicalProcessPositivelyRegulatesMolecularFunctionReverse: [BiologicalProcess!]!
    @relationship(
      type: "Biological_process_positively_regulates_molecular_function"
      direction: IN
    )
  molecularFunctionIsAMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Molecular_function_is_a_molecular_function"
      direction: OUT
    )
  molecularFunctionNegativelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Molecular_function_negatively_regulates_molecular_function"
      direction: OUT
    )
  molecularFunctionPartOfMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Molecular_function_part_of_molecular_function"
      direction: OUT
    )
  molecularFunctionPositivelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Molecular_function_positively_regulates_molecular_function"
      direction: OUT
    )
  proteinContributesToMolecularFunctionReverse: [Protein!]!
    @relationship(
      type: "Protein_contributes_to_molecular_function"
      direction: IN
      properties: "Protein_contributes_to_molecular_function"
    )
  proteinDomainEnablesMolecularFunctionReverse: [ProteinDomain!]!
    @relationship(
      type: "Protein_domain_enables_molecular_function"
      direction: IN
    )
  proteinEnablesMolecularFunctionReverse: [Protein!]!
    @relationship(
      type: "Protein_enables_molecular_function"
      direction: IN
      properties: "Protein_enables_molecular_function"
    )
}

type OrganismTaxon @node {
  id: ID
  organism_name: String
  organismCausesDisease: [Disease!]!
    @relationship(
      type: "Organism_causes_disease",
      direction: OUT,
    )
  proteinBelongsToOrganismReverse: [Protein!]!
    @relationship(
      type: "Protein_belongs_to_organism"
      direction: IN
    )
}

type Pathway @node {
  id: ID
  biokeen_embedding: [Float]
  name: String
  organism: String
  diseaseModulatesPathwayReverse: [Disease!]!
    @relationship(
      type: "Disease_modulates_pathway"
      direction: IN
      properties: "Disease_modulates_pathway"
    )
  drugHasTargetInPathwayReverse: [Drug!]!
    @relationship(
      type: "Drug_has_target_in_pathway"
      direction: IN
      properties: "Drug_has_target_in_pathway"
    )
  pathwayIsEquivalentToPathway: [Pathway!]!
    @relationship(
      type: "Pathway_is_equivalent_to_pathway"
      direction: OUT
    )
  pathwayIsPartOfPathway: [Pathway!]!
    @relationship(
      type: "Pathway_is_part_of_pathway"
      direction: OUT
    )
  pathwayIsOrthologToPathway: [Pathway!]!
    @relationship(
      type: "Pathway_is_ortholog_to_pathway"
      direction: OUT
    )

  pathwayParticipatesPathway: [Pathway!]!
    @relationship(
      type: "Pathway_participates_pathway"
      direction: OUT
    )
  proteinTakePartInPathwayReverse: [Protein!]!
    @relationship(
      type: "Protein_take_part_in_pathway"
      direction: IN
      properties: "Protein_take_part_in_pathway"
    )
  ## EXTRA RELATION
}

type Phenotype @node {
  id: ID
  cada_embedding: [Float]
  name: String
  synonyms: [String]
  phenotypeIsAPhenotype: [Phenotype!]!
    @relationship(
      type: "Phenotype_is_a_phenotype"
      direction: OUT
    )
  phenotypeIsAssociatedWithDisease: [Disease!]!
    @relationship(
      type: "Phenotype_is_associated_with_disease"
      direction: OUT
      properties: "Phenotype_is_associated_with_disease"
    )
  proteinIsAssociatedWithPhenotypeReverse: [Phenotype!]!
    @relationship(
      type: "Protein_is_associated_with_phenotype"
      direction: IN
    )
}

type Protein @node {
  id: ID
  esm2_embedding: [Float]
  length: Int
  mass: Int
  organism_id: Int
  organism_name: String
  primary_protein_name: String
  protein_names: [String]
  prott5_embedding: [Float]
  sequence: String
  xref_proteomes: [String]
  compoundTargetsProteinReverse: [Compound!]!
    @relationship(
      type: "Compound_targets_protein"
      direction: IN
      properties: "Compound_targets_protein"
    )
  drugTargetsProteinReverse: [Drug!]!
    @relationship(
      type: "Drug_targets_protein"
      direction: IN
      properties: "Drug_targets_protein"
    )
  geneEncodesProteinReverse: [Gene!]!
    @relationship(
      type: "Gene_encodes_protein"
      direction: IN
    )
  proteinBelongsToOrganism: [OrganismTaxon!]!
    @relationship(
      type: "Protein_belongs_to_organism"
      direction: OUT
    )
  proteinCatalyzesEcNumber: [EcNumber!]!
    @relationship(
      type: "Protein_catalyzes_ec_number"
      direction: OUT
    )
  proteinContributesToMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Protein_contributes_to_molecular_function"
      direction: OUT
      properties: "Protein_contributes_to_molecular_function"
    )
  proteinEnablesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Protein_enables_molecular_function"
      direction: OUT
      properties: "Protein_enables_molecular_function"
    )
  proteinHasDomain: [ProteinDomain!]!
    @relationship(
      type: "Protein_has_domain"
      direction: OUT
      properties: "Protein_has_domain"
    )
  proteinInteractsWithProtein: [Protein!]!
    @relationship(
      type: "Protein_interacts_with_protein"
      direction: OUT
      properties: "Protein_interacts_with_protein"
    )
  proteinInvolvedInBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "Protein_involved_in_biological_process"
      direction: OUT
      properties: "Protein_involved_in_biological_process"
    )
  proteinIsActiveInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "Protein_is_active_in_cellular_component"
      direction: OUT
      properties: "Protein_is_active_in_cellular_component"
    )
  proteinIsAssociatedWithPhenotype: [Phenotype!]!
    @relationship(
      type: "Protein_is_associated_with_phenotype"
      direction: OUT
    )
  proteinLocatedInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "Protein_located_in_cellular_component"
      direction: OUT
      properties: "Protein_located_in_cellular_component"
    )
  proteinPartOfInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "Protein_part_of_cellular_component"
      direction: OUT
      properties: "Protein_part_of_cellular_component"
    )
  proteinTakePartInPathway: [Pathway!]!
    @relationship(
      type: "Protein_take_part_in_pathway"
      direction: OUT
      properties: "Protein_take_part_in_pathway"
    )
}

type ProteinDomain @node {
  id: ID
  name: String
  dom2vec_embedding: [Float]
  child_list: [String]
  ec: [String]
  parent_list: [String]
  pdb: [String]
  pfam: [String]
  protein_count: Int
  type: String
  proteinDomainEnablesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "Protein_domain_enables_molecular_function"
      direction: OUT
    )
  proteinDomainInvolvedInBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "Protein_domain_involved_in_biological_process"
      direction: OUT
    )
  proteinDomainLocatedInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "Protein_domain_located_in_cellular_component"
      direction: OUT
    )
  proteinHasDomainReverse: [Protein!]!
    @relationship(
      type: "Protein_has_domain"
      direction: IN
      properties: "Protein_has_domain"
    )
}

type Reaction @node {
  id: ID
  name: String
  rxnfp_embedding: [Float]
}

type SideEffect @node {
  id: ID
  name: String
  synonyms: [String]
  drugHasSideEffectReverse: [Drug!]!
    @relationship(
      type: "Drug_has_side_effect"
      direction: IN
      properties: "Drug_has_side_effect"
    )
  sideEffectIsASideEffect: [SideEffect!]!
    @relationship(
      type: "Side_effect_is_a_side_effect"
      direction: OUT
    )
}

###########################
# Relationship interfaces #
###########################

###
# BiologicalProcess -> Any
###

###
# CellularComponent -> Any
###

###
# Disease -> Any
###

interface Disease_is_associated_with_disease @relationshipProperties {
  disgenet_jaccard_genes_score: Float
  disgenet_jaccard_variants_score: Float
  source: [String]
}

interface Disease_is_treated_by_drug @relationshipProperties {
  max_phase: Int
  pubmed_ids: [String]
  source: [String]
}

interface Disease_modulates_pathway @relationshipProperties {
  source: [String]
}

###
# EcNumber -> Any
###

###
# Gene -> Any
###

interface Gene_is_orthologous_with_gene @relationshipProperties {
  oma_orthology_score: Float
  relation_type: String
  source: [String]
}

interface Gene_is_related_to_disease @relationshipProperties {
  allele_id: String
  clinical_significance: String
  dbsnp_id: [String]
  diseases_confidence_score: Float
  disgenet_gene_disease_score: Float
  disgenet_variant_disease_score: Float
  opentargets_score: Float
  pubmed_ids: [String]
  review_status: Int
  source: [String]
  variant_source: [String]
  variation_id: String
}

interface Gene_regulates_gene @relationshipProperties {
  dorothea_confidence_level: String
  pubmed_id: [String]
  source: [String]
  tf_effect: String
}

###
# MolecularFunction -> Any
###

###
# Compound -> Any
###

interface Compound_targets_protein @relationshipProperties {
  id: ID
  activity_type: String
  activity_value: Float
  assay_chembl: [String]
  confidence_score: Float
  pchembl: Float
  references: [String]
  source: [String]
  stitch_combined_score: Float
}

###
# OrganismTaxon -> Any
###

###
# Pathway -> Any
###

###
# Phenotype -> Any
###

interface Phenotype_is_associated_with_disease @relationshipProperties {
  evidence: String
  pubmed_ids: [String]
}

###
# Protein -> Any
###

interface Protein_contributes_to_molecular_function @relationshipProperties {
  evidence_code: String
  reference: String
}

interface Protein_enables_molecular_function @relationshipProperties {
  evidence_code: String
  reference: String
}

interface Protein_has_domain @relationshipProperties {
  start: String
  end: String
}

interface Protein_interacts_with_protein @relationshipProperties {
  intact_score: Float
  interaction_type: String
  method: String
  pubmed_id: [String]
  source: [String]
  string_combined_score: Int
  string_physical_combined_score: Int
}

interface Protein_involved_in_biological_process @relationshipProperties {
  evidence_code: String
  reference: String
}

interface Protein_is_active_in_cellular_component @relationshipProperties {
  evidence_code: String
  reference: String
}

interface Protein_located_in_cellular_component @relationshipProperties {
  evidence_code: String
  reference: String
}

interface Protein_part_of_cellular_component @relationshipProperties {
  evidence_code: String
  reference: String
}

interface Protein_take_part_in_pathway @relationshipProperties {
  source: String
}

###
# ProteinDomain -> Any
###

###
# SideEffect -> Any
###

###
# Drug -> Any
###

interface Drug_downregulates_gene @relationshipProperties {
  references: [String]
}

interface Drug_has_side_effect @relationshipProperties {
  frequency: String
  proportional_reporting_ratio: Float
  source: [String]
}

interface Drug_has_target_in_pathway @relationshipProperties {
  source: String
}

interface Drug_upregulates_gene @relationshipProperties {
  references: [String]
}

interface Drug_interacts_with_drug @relationshipProperties {
  interaction_level: String
  interaction_type: [String]
  recommendation: String
  source: [String]
}

interface Drug_targets_protein @relationshipProperties {
  activity_type: String
  activity_value: Float
  confidence_score: Float
  dgidb_score: Float
  direct_interaction: Boolean
  disease_efficacy: Boolean
  known_action: String
  mechanism_of_action: String
  mechanism_of_action_type: String
  pchembl: Float
  references: [String]
  source: [String]
  stitch_combined_score: Float
}
`

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.MY_NEO4J_PASSWORD)
);

/*const resolvers = {
    Mutation: {
      updateSomething: () => {
        throw new Error('Mutations are disabled.');
      },
    },
  };  
*/
const neoSchema = new Neo4jGraphQL({typeDefs, driver});// resolvers, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req, sessionConfig: { database: process.env.NEO4J_DATABASE_NAME }}),
    listen: { port: process.env.API_PORT },
});

console.log(`🚀 Server ready at ${url}`);

