import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class RootController {
  @Get('/api')
  apiInfo() {
    return {
      name: 'Infsus IST API',
      docs: '/api/docs',
      docsJson: '/api/docs-json'
    }
  }

  @Get()
  @Redirect('/api/docs', 302)
  redirectToDocs() {}
}
