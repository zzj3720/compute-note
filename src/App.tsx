import {defineComponent, reactive, watchEffect} from "vue";
import {v1} from "uuid";

const rootId = v1();

interface Instance {
    id: string;
    parentId: string;
    value: string;
    children: string[];
}

const keys = '0123456789.+-*/x'.split('');

interface ComputeNote {
    data: {
        roots: string[]
        instanceMap: Record<string, Instance>
    }
}

const ComputedNote = {}

// const createComputeNote = ():ComputeNote => {
//     const id = v1();
//     return {
//         data:reactive({
//             roots:[id],
//             instanceMap:{
//                 [id]:{
//                     id,
//                     parentId:
//                 },
//             }
//         })
//     }
// }

export const App = defineComponent(() => {
    const id = v1()
    const instanceMap = reactive<Record<string, Instance>>({
        [id]: {
            id,
            parentId: rootId,
            value: '123',
            children: []
        }
    })
    const roots = reactive<string[]>([id])
    watchEffect((cancel) => {
        let listener = (e: Event) => {
            console.log(`zuozijian src/App.tsx:27`, e)
            console.log(getSelection());
        };
        document.addEventListener('selectionchange', listener)
        cancel(() => {
            document.removeEventListener('selectionchange', listener)
        })
    })
    return () => <div>
        {roots.map(id => {
            const children = instanceMap[id].children.map(id => instanceMap[id]);
            return <div key={id} style={{
                display: 'flex'
            }}>
                <div style={{
                    height: '14px',
                    borderBottom: '1px solid black',
                    padding: '0 3px',
                    fontSize: '12px',
                    outline: 'none',
                    flex: 1,
                }}
                     contenteditable
                     onCompositionstart={e => {
                         e.preventDefault();
                     }}
                     onCompositionupdate={e => {
                         e.preventDefault();
                     }}
                     onCompositionend={e => {
                         e.preventDefault();

                     }}
                     onInput={e => {
                         e.preventDefault();
                     }}
                     onBeforeinput={e => {
                         const ev = e as InputEvent;
                         e.preventDefault();
                         const isEnter = ev.inputType === 'insertParagraph' || ev.data === '=';
                         if (isEnter) {
                             return;
                         }
                         if (keys.indexOf(ev.data || '') > -1) {
                             const children = instanceMap[id].children;
                             if (children.length < 1) {
                                 const newId = v1();
                                 instanceMap[newId] = {
                                     id: newId,
                                     parentId: id,
                                     value: '',
                                     children: []
                                 }
                                 instanceMap[id].children.push(newId)
                             }
                             const last = children[children.length - 1];
                             instanceMap[last].value += ev.data;
                             console.dir((ev.target as HTMLDivElement).lastChild)
                             return
                         }
                     }}>
                    {children.map(instance => {
                        return <div style={{width: 'max-content', display: 'inline-block'}} contenteditable={false}>
                            {instance.value}
                        </div>
                    })}
                </div>
                <div>{safeEval(children.map(v => v.value).join(''))}</div>
            </div>
        })}
    </div>
})
const safeEval = (s: string) => {
    try {
        return eval(s)
    } catch (e) {
        return 'No Result'
    }
}
