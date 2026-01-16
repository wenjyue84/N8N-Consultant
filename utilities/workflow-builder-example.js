/**
 * N8N Workflow Builder - Example Usage
 * Demonstrates how to use the WorkflowBuilder class
 */

const { WorkflowBuilder } = require('./workflow-builder');

/**
 * Example 1: Simple HTTP to Notification workflow
 */
function createSimpleApiWorkflow() {
  console.log('Creating simple API workflow...\n');

  const builder = new WorkflowBuilder(
    'Weather to Telegram',
    'Fetch weather data and send to Telegram'
  );

  // Add nodes
  builder
    .addManualTrigger()
    .addHttpRequest('https://api.openweathermap.org/data/2.5/weather', {
      id: 'fetch-weather',
      name: 'Fetch Weather Data',
      queryParameters: {
        parameters: [
          { name: 'q', value: 'London' },
          { name: 'appid', value: 'YOUR_API_KEY' }
        ]
      }
    })
    .addCode(`
// Format weather data for Telegram
const weather = $input.first().json;
return [{
  json: {
    message: \`Weather in \${weather.name}:
Temperature: \${weather.main.temp}K
Description: \${weather.weather[0].description}\`
  }
}];
    `.trim(), {
      id: 'format-message',
      name: 'Format Message'
    });

  // Connect nodes
  builder
    .connect('manual-trigger', 'fetch-weather')
    .connect('fetch-weather', 'format-message');

  // Save workflow
  const filepath = builder.save('weather-to-telegram.json');
  console.log(`Workflow JSON saved to: ${filepath}\n`);

  // Generate documentation
  const docs = builder.generateDocs();
  console.log('Generated Documentation:');
  console.log(docs);

  return builder.build();
}

/**
 * Example 2: Scheduled workflow with webhook
 */
function createScheduledWorkflow() {
  console.log('\nCreating scheduled workflow...\n');

  const builder = new WorkflowBuilder(
    'Daily Task Reminder',
    'Send daily task reminders every morning at 8am'
  );

  // Add schedule trigger (8am daily)
  builder
    .addScheduleTrigger('0 8 * * *', {
      name: 'Every Day at 8am'
    })
    .addHttpRequest('https://api.example.com/tasks', {
      id: 'fetch-tasks',
      name: 'Fetch Today\'s Tasks',
      queryParameters: {
        parameters: [
          { name: 'date', value: '={{ $now.format("yyyy-MM-dd") }}' }
        ]
      }
    })
    .addCode(`
// Format tasks for email
const tasks = $input.all();
const taskList = tasks.map(t => \`- \${t.json.title}\`).join('\\n');
return [{
  json: {
    subject: 'Daily Task Summary',
    body: \`Here are your tasks for today:\\n\\n\${taskList}\`
  }
}];
    `.trim(), {
      id: 'format-email',
      name: 'Format Email'
    });

  // Connect nodes
  builder
    .connect('schedule-trigger', 'fetch-tasks')
    .connect('fetch-tasks', 'format-email');

  // Save
  builder.save('daily-task-reminder.json');

  return builder.build();
}

/**
 * Example 3: Webhook with conditional logic
 */
function createWebhookWorkflow() {
  console.log('\nCreating webhook workflow with conditions...\n');

  const builder = new WorkflowBuilder(
    'Smart Webhook Handler',
    'Handle webhook requests with conditional routing'
  );

  // Add webhook trigger
  builder
    .addWebhookTrigger('smart-handler', {
      method: 'POST',
      name: 'Webhook Trigger'
    })
    .addCode(`
// Check if urgent
const data = $input.first().json;
return [{
  json: {
    ...data,
    isUrgent: data.priority === 'high'
  }
}];
    `.trim(), {
      id: 'check-priority',
      name: 'Check Priority'
    });

  // Connect
  builder
    .connect('webhook-trigger', 'check-priority');

  // Save
  builder.save('smart-webhook-handler.json');

  return builder.build();
}

/**
 * Run examples
 */
async function main() {
  console.log('='.repeat(50));
  console.log('N8N Workflow Builder - Examples');
  console.log('='.repeat(50));

  try {
    // Example 1: Simple API workflow
    createSimpleApiWorkflow();

    // Example 2: Scheduled workflow
    createScheduledWorkflow();

    // Example 3: Webhook workflow
    createWebhookWorkflow();

    console.log('\n' + '='.repeat(50));
    console.log('✅ All examples completed!');
    console.log('Check the workflow-templates/ directory for generated files.');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createSimpleApiWorkflow,
  createScheduledWorkflow,
  createWebhookWorkflow
};
