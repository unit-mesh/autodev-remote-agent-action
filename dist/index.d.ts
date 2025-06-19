import express from 'express';
import { Webhooks } from '@octokit/webhooks';
export { CodeContext, GitHubAgentImplementation, GitHubConfig, GitHubIssue, IssueAnalysisResult } from '@autodev/remote-agent';

interface ActionConfig {
    githubToken: string;
    workspacePath?: string;
    webhookSecret?: string;
    autoComment?: boolean;
    autoLabel?: boolean;
    analysisDepth?: 'shallow' | 'medium' | 'deep';
    triggerEvents?: string[];
    excludeLabels?: string[];
    includeLabels?: string[];
    includeConfigFiles?: boolean;
    includeTestFiles?: boolean;
    includePatterns?: string[];
    excludePatterns?: string[];
    forceIncludeFiles?: string[];
}
interface WebhookPayload {
    action: string;
    issue?: {
        id: number;
        number: number;
        title: string;
        body: string | null;
        state: 'open' | 'closed';
        user: {
            login: string;
            id: number;
        } | null;
        labels: Array<{
            id: number;
            name: string;
            color: string;
            description: string | null;
        }>;
        assignees: Array<{
            login: string;
            id: number;
        }>;
        created_at: string;
        updated_at: string;
        html_url: string;
    };
    repository: {
        id: number;
        name: string;
        full_name: string;
        owner: {
            login: string;
            id: number;
        };
        default_branch: string;
        clone_url: string;
        html_url: string;
    };
    sender: {
        login: string;
        id: number;
    };
}
interface AnalysisOptions {
    depth?: 'shallow' | 'medium' | 'deep';
    includeCodeSearch?: boolean;
    includeSymbolAnalysis?: boolean;
    maxFiles?: number;
    timeout?: number;
    includeConfigFiles?: boolean;
    includeTestFiles?: boolean;
    includePatterns?: string[];
    excludePatterns?: string[];
    forceIncludeFiles?: string[];
}
interface AnalysisProcessInfo {
    filesScanned: number;
    filesAnalyzed: number;
    filesFiltered: number;
    filteredFiles: Array<{
        path: string;
        reason: string;
        relevanceScore?: number;
    }>;
    analysisSteps: Array<{
        step: string;
        status: 'completed' | 'failed' | 'skipped';
        duration: number;
        details?: string;
    }>;
    llmCalls: Array<{
        purpose: string;
        success: boolean;
        duration: number;
        error?: string;
    }>;
}
interface ActionResult {
    success: boolean;
    analysisResult?: any;
    commentAdded?: boolean;
    labelsAdded?: string[];
    error?: string;
    executionTime?: number;
    processInfo?: AnalysisProcessInfo;
}
interface LabelConfig {
    bugLabel?: string;
    featureLabel?: string;
    documentationLabel?: string;
    enhancementLabel?: string;
    questionLabel?: string;
    analysisCompleteLabel?: string;
}
interface ActionContext {
    owner: string;
    repo: string;
    issueNumber: number;
    eventType: string;
    action: string;
    workspacePath: string;
    config: ActionConfig;
}
interface WebhookHandlerOptions {
    secret?: string;
    path?: string;
    port?: number;
    onIssueOpened?: (payload: WebhookPayload) => Promise<void>;
    onIssueEdited?: (payload: WebhookPayload) => Promise<void>;
    onIssueLabeled?: (payload: WebhookPayload) => Promise<void>;
    onIssueAssigned?: (payload: WebhookPayload) => Promise<void>;
}
interface AnalysisReport {
    issueNumber: number;
    repository: string;
    analysisTimestamp: string;
    summary: string;
    codeReferences: Array<{
        file: string;
        line?: number;
        relevance: number;
        description: string;
    }>;
    suggestions: Array<{
        type: 'fix' | 'enhancement' | 'investigation';
        priority: 'low' | 'medium' | 'high';
        description: string;
        location?: string;
    }>;
    relatedIssues?: Array<{
        number: number;
        title: string;
        similarity: number;
    }>;
    estimatedComplexity?: 'low' | 'medium' | 'high';
    recommendedLabels?: string[];
}

interface ProcessIssueOptions {
    owner: string;
    repo: string;
    issueNumber: number;
    action?: string;
    depth?: 'shallow' | 'medium' | 'deep';
    autoComment?: boolean;
    autoLabel?: boolean;
}
declare class GitHubActionService {
    private octokit;
    private config;
    constructor(config?: Partial<ActionConfig>);
    /**
     * Load configuration from GitHub Actions inputs or environment
     */
    private loadConfig;
    /**
     * Get input value (works in both GitHub Actions and standalone mode)
     */
    private getInput;
    /**
     * Get boolean input value
     */
    private getBooleanInput;
    /**
     * Process an issue with simplified options
     */
    processIssue(options: ProcessIssueOptions): Promise<ActionResult>;
    /**
     * Process an issue with full context
     */
    processIssueWithContext(context: ActionContext): Promise<ActionResult>;
    /**
     * Validate that the issue exists and is accessible
     */
    private validateIssue;
    /**
     * Add analysis comment to the issue
     */
    private addAnalysisComment;
    /**
     * Add labels to the issue
     */
    private addLabelsToIssue;
    /**
     * Set GitHub Actions outputs
     */
    private setOutputs;
    /**
     * Set error output for GitHub Actions
     */
    private setErrorOutput;
    /**
     * Get current configuration
     */
    getConfig(): ActionConfig;
    /**
     * Update configuration
     */
    updateConfig(updates: Partial<ActionConfig>): void;
}

declare class IssueAnalyzer {
    private githubService;
    private contextAnalyzer;
    private reportGenerator;
    private llmService;
    private context;
    private labelConfig;
    private processInfo;
    constructor(context: ActionContext);
    /**
     * Analyze an issue using the same logic as analyze-issue.js
     */
    analyzeIssue(options?: AnalysisOptions): Promise<ActionResult>;
    /**
     * Extract labels from analysis text using simple pattern matching
     */
    private extractLabelsFromAnalysis;
    /**
     * Generate comment text for the issue using LLM (similar to agent.ts approach)
     */
    generateComment(analysisResult: any): Promise<string>;
    /**
     * Generate enhanced comment using LLM
     */
    private generateEnhancedComment;
    /**
     * Generate basic formatted comment with detailed content as final fallback
     */
    private generateBasicFormattedComment;
    /**
     * Generate enhanced formatted comment without LLM
     */
    private generateEnhancedFormattedComment;
    /**
     * Add process details to comment for transparency
     */
    private addProcessDetailsToComment;
    /**
     * Generate diagnostic comment when analysis results are insufficient
     */
    private generateProcessDiagnosticComment;
    /**
     * Format LLM analysis report as a GitHub comment
     */
    private formatLLMReportAsComment;
    /**
     * Update label configuration
     */
    setLabelConfig(config: Partial<LabelConfig>): void;
    /**
     * Scan workspace files to understand what's available
     */
    private scanWorkspaceFiles;
    /**
     * Get all files in workspace recursively
     */
    private getWorkspaceFiles;
    /**
     * Check if file is a configuration file
     */
    private isConfigFile;
    /**
     * Check if file is a test file
     */
    private isTestFile;
    /**
     * Check if file is a source file
     */
    private isSourceFile;
    /**
     * Add an analysis step to the process tracking
     */
    private addAnalysisStep;
    /**
     * Add an LLM call to the process tracking
     */
    private addLLMCall;
    /**
     * Track which files were analyzed vs filtered by the ContextAnalyzer
     */
    private trackAnalysisResults;
    /**
     * Identify specific important files that were filtered out
     */
    private identifyFilteredImportantFiles;
    /**
     * Check if a file is considered important for analysis
     */
    private isImportantFile;
    /**
     * Check if file is a package/dependency file
     */
    private isPackageFile;
    /**
     * Check if file is a documentation file
     */
    private isDocumentationFile;
    /**
     * Get the reason why a file was likely filtered
     */
    private getFilterReason;
    /**
     * Add generic examples when specific detection fails
     */
    private addGenericFilteredFileExamples;
    /**
     * Generate specific suggestions based on filtered file types
     */
    private generateFilteringSuggestions;
    /**
     * Log a summary of the analysis process
     */
    private logAnalysisSummary;
}

declare class WebhookHandler {
    private app;
    private webhooks;
    private actionService;
    private options;
    constructor(actionService: GitHubActionService, options?: WebhookHandlerOptions);
    /**
     * Setup webhook event handlers
     */
    private setupWebhookHandlers;
    /**
     * Setup Express routes
     */
    private setupRoutes;
    /**
     * Handle issue events (opened, edited, etc.)
     */
    private handleIssueEvent;
    /**
     * Determine if an issue should be processed based on configuration
     */
    private shouldProcessIssue;
    /**
     * Get action configuration from environment or defaults
     */
    private getActionConfig;
    /**
     * Start the webhook server
     */
    start(): Promise<void>;
    /**
     * Get the Express app instance
     */
    getApp(): express.Application;
    /**
     * Get webhook instance for advanced configuration
     */
    getWebhooks(): Webhooks;
}

/**
 * AutoDev Remote Agent
 *
 * Automated GitHub issue analysis using AI-powered code analysis.
 * This package provides both GitHub Actions integration and standalone webhook server capabilities.
 */

/**
 * Main entry point for GitHub Actions
 * This function is called when the action runs in a GitHub workflow
 */
declare function run(): Promise<void>;
/**
 * Create and start a webhook server for standalone operation
 */
declare function startWebhookServer(options?: {
    port?: number;
    webhookSecret?: string;
    githubToken?: string;
    workspacePath?: string;
}): Promise<WebhookHandler>;
/**
 * Analyze a specific issue (for manual/programmatic use)
 */
declare function analyzeIssue(options: {
    owner: string;
    repo: string;
    issueNumber: number;
    githubToken?: string;
    workspacePath?: string;
    depth?: 'shallow' | 'medium' | 'deep';
    autoComment?: boolean;
    autoLabel?: boolean;
}): Promise<ActionResult>;
/**
 * Utility function to validate configuration
 */
declare function validateConfig(): {
    valid: boolean;
    errors: string[];
};
/**
 * Get version information
 */
declare function getVersion(): string;
/**
 * Default export for convenience
 */
declare const _default: {
    run: typeof run;
    startWebhookServer: typeof startWebhookServer;
    analyzeIssue: typeof analyzeIssue;
    validateConfig: typeof validateConfig;
    getVersion: typeof getVersion;
    GitHubActionService: typeof GitHubActionService;
    WebhookHandler: typeof WebhookHandler;
};

export { GitHubActionService, IssueAnalyzer, WebhookHandler, analyzeIssue, _default as default, getVersion, run, startWebhookServer, validateConfig };
export type { ActionConfig, ActionContext, ActionResult, AnalysisOptions, AnalysisReport, LabelConfig, ProcessIssueOptions, WebhookHandlerOptions, WebhookPayload };
