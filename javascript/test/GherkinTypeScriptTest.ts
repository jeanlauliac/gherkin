/* eslint-env mocha */
import * as assert from 'assert'
import * as gherkin from "../src";
import {Readable} from "stream";
import {io} from "cucumber-messages";
import EventWrapper = io.cucumber.messages.EventWrapper;
import Source = io.cucumber.messages.Source;
import Media = io.cucumber.messages.Media;

describe('gherkin (TypeScript)', () => {
  it('parses gherkin from the file system', async () => {
    const wrappers = await streamToArray(
      gherkin.fromPaths(['testdata/good/minimal.feature'])
    )
    assert.strictEqual(wrappers.length, 3)
  })

  it('parses gherkin from STDIN', async () => {
    const source = Source.fromObject({
      uri: 'test.feature',
      data: `Feature: Minimal

  Scenario: minimalistic
    Given the minimalism
`,
      media: Media.fromObject({
        encoding: 'UTF-8',
        contentType: 'text/x.cucumber.gherkin+plain',
      }),
    })

    const wrappers = await streamToArray(gherkin.fromSources([source]))
    assert.strictEqual(wrappers.length, 3)
  })
})

async function streamToArray(readableStream: Readable): Promise<EventWrapper[]> {
  return new Promise<EventWrapper[]>((resolve: (wrappers:EventWrapper[]) => void, reject: (err:Error) => void) => {
    const items: EventWrapper[] = []
    readableStream.on('data', items.push.bind(items))
    readableStream.on('error', (err:Error) => reject(err))
    readableStream.on('end', () => resolve(items))
  })
}
