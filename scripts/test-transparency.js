#!/usr/bin/env node

/**
 * Test script to demonstrate the new analysis transparency features
 */

const { analyzeIssue } = require('../dist/index.js');

async function testTransparencyFeatures() {
  console.log('🧪 Testing Analysis Transparency Features\n');

  // Test configuration
  const testConfig = {
    owner: 'unit-mesh',
    repo: 'autodev-remote-agent-action',
    issueNumber: 1, // Replace with an actual issue number
    depth: 'medium',
    autoComment: false, // Don't actually comment during testing
    autoLabel: false   // Don't actually label during testing
  };

  try {
    console.log('🔍 Starting analysis with transparency features...');
    console.log(`📋 Analyzing issue #${testConfig.issueNumber} in ${testConfig.owner}/${testConfig.repo}`);
    console.log('');

    const result = await analyzeIssue(testConfig);

    if (result.success) {
      console.log('✅ Analysis completed successfully!\n');
      
      // Display process information
      if (result.processInfo) {
        console.log('📊 Process Transparency Information:');
        console.log('=====================================');
        console.log(`Files scanned: ${result.processInfo.filesScanned}`);
        console.log(`Files analyzed: ${result.processInfo.filesAnalyzed}`);
        console.log(`Files filtered: ${result.processInfo.filesFiltered}`);
        console.log(`Analysis steps: ${result.processInfo.analysisSteps.length}`);
        console.log(`LLM calls: ${result.processInfo.llmCalls.length}`);
        console.log('');

        // Show analysis steps
        if (result.processInfo.analysisSteps.length > 0) {
          console.log('🔄 Analysis Steps:');
          result.processInfo.analysisSteps.forEach((step, index) => {
            const status = step.status === 'completed' ? '✅' : 
                          step.status === 'failed' ? '❌' : '⏭️';
            console.log(`  ${index + 1}. ${status} ${step.step} (${step.duration}ms)`);
            if (step.details) {
              console.log(`     ${step.details}`);
            }
          });
          console.log('');
        }

        // Show LLM calls
        if (result.processInfo.llmCalls.length > 0) {
          console.log('🧠 LLM Calls:');
          result.processInfo.llmCalls.forEach((call, index) => {
            const status = call.success ? '✅' : '❌';
            console.log(`  ${index + 1}. ${status} ${call.purpose} (${call.duration}ms)`);
            if (call.error) {
              console.log(`     Error: ${call.error}`);
            }
          });
          console.log('');
        }

        // Show filtered files
        if (result.processInfo.filteredFiles.length > 0) {
          console.log('⚠️ Important Files That Were Filtered:');
          result.processInfo.filteredFiles.forEach((file, index) => {
            console.log(`  ${index + 1}. ${file.path}`);
            console.log(`     Reason: ${file.reason}`);
          });
          console.log('');
        }

        // Analysis insights
        const filterRatio = result.processInfo.filesFiltered / result.processInfo.filesScanned;
        if (filterRatio > 0.8) {
          console.log('🚨 High Filter Ratio Detected!');
          console.log(`   ${Math.round(filterRatio * 100)}% of files were filtered out.`);
          console.log('   This suggests the issue description might be too generic.');
          console.log('   Consider being more specific about affected files or areas.');
          console.log('');
        }
      }

      // Show execution time
      console.log(`⏱️ Total execution time: ${result.executionTime}ms`);
      
      if (result.labelsAdded && result.labelsAdded.length > 0) {
        console.log(`🏷️ Labels that would be added: ${result.labelsAdded.join(', ')}`);
      }

    } else {
      console.error('❌ Analysis failed:', result.error);
      
      // Show process info even for failed analysis
      if (result.processInfo) {
        console.log('\n📊 Process Information (from failed analysis):');
        console.log(`Files scanned: ${result.processInfo.filesScanned || 0}`);
        console.log(`Analysis steps attempted: ${result.processInfo.analysisSteps.length}`);
        
        const failedSteps = result.processInfo.analysisSteps.filter(s => s.status === 'failed');
        if (failedSteps.length > 0) {
          console.log('\n❌ Failed Steps:');
          failedSteps.forEach(step => {
            console.log(`  - ${step.step}: ${step.details}`);
          });
        }
      }
    }

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testTransparencyFeatures()
    .then(() => {
      console.log('\n🎉 Transparency test completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testTransparencyFeatures };
