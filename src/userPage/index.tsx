import { Button } from 'boot-cell/source/Form/Button';
import { createCell, component, mixin } from 'web-cell';

export function InlineTag({ defaultSlot }: any) {
    return <span>{defaultSlot}</span>;
}

@component({
    tagName: 'user_page-tag',
    renderTarget: 'children'
})
export class UserPage extends mixin() {
    render() {
        return (
            <InlineTag>
                test
                <Button>fadfs</Button>
            </InlineTag>
        );
    }
}
